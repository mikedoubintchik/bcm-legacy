(function () {
  angular
    .module('blueconnect.mobile.directive.editAutopayFlowPageReview', [])
    .directive('editAutopayFlowPageReview', function () {
      return {
        scope: {
          serviceResponse: '<'
        },
        templateUrl: 'partials/edit-autopay-flow-page-review.html',
        controller: ['config', 'PaymentFlowFactory', '$http', '$q', '$rootScope', '$scope',
          function (config, PaymentFlowFactory, $http, $q, $rootScope, $scope) {
            $scope.loc = $rootScope.loc;
            $scope.submissionError = false;
            $scope.gotoView = $rootScope.gotoView;
            $scope.userSetData = PaymentFlowFactory.getUserSetData();

            $scope.trackerInfo = {
              step: 'REVIEW'
            };

            // goToPaymentDetails is used by the cancel modal
            $scope.goToPaymentDetails = function () {
              PaymentFlowFactory.resetCreditCardDetails();
              $rootScope.gotoView('edit-autopay-flow/details');
            };

            $scope.backModalObj = {
              title: $scope.loc.BP_HEADER_ARE_YOU_SURE,
              body: $scope.loc.BP_EDIT_PAYMENT_REENTER_DETAILS,
              cancelButton: {
                title: $scope.loc.BP_CONTINUE_TO_MAKE_PAYMENT
              },
              confirmButton: {
                color: 'blue',
                title: $scope.loc.BP_EDIT_PAYMENT_INFO
              }
            };

            $scope.$on('PAGE_BACK', function () {
              if (PaymentFlowFactory.getPaymentMethod() === 'creditcard') {
                //$scope.openModal is not defined because it's an alias passed into
                // the extendable-alert-modal directive
                return $scope.openBackModal();
                ;
              }
              $rootScope.gotoView('edit-autopay-flow/details');
            });

            $scope.localizedPaymentMethod = (
              PaymentFlowFactory.getPaymentMethod() === 'bankdraft' ?
                $scope.loc.BP_BANK_DRAFT :
                $scope.loc.BP_CREDIT_CARD
            );

            var billingMethod = PaymentFlowFactory.getBillingMethod();
            if (billingMethod === 'none') {
              $scope.localizedBillingMethod = $scope.loc.BP_DO_NOT_SEND_COPY_OF_BILL;
            }
            if (billingMethod === 'email') {
              $scope.localizedBillingMethod = $scope.loc.EMAIL;
            }


            $scope.submitPreferences = function () {
              $scope.submissionError = false;
              $rootScope.$emit('pageLoading');
              switch ($scope.userSetData.paymentMethod) {
                case 'bankdraft':
                  submitBankAutopayDetails()
                    .then(function () {
                      $scope.userSetData.paymentErrorCode = 100;
                      $scope.userSetData.successConfirmationCode = 123456789;
                      $rootScope.$emit('pageLoaded');

                      return $rootScope.gotoView('edit-autopay-flow/confirmation');
                    })
                    .catch(function (err) {
                      $scope.submissionError = true;
                      $rootScope.$emit('pageLoaded');
                    });
                  break;
                case 'creditcard':
                  submitCreditCardToCyberSource()
                    .then(function (encryptedPaymentData) {
                      $scope.userSetData.encryptedPaymentData = encryptedPaymentData;
                      return doStk2(encryptedPaymentData);
                    })
                    .then(function (response) {
                      $scope.userSetData.paymentErrorCode = response.data.statusCode;
                      $scope.userSetData.successConfirmationCode = response.data.merchantReferenceCode;
                      $rootScope.$emit('pageLoaded');
                      return $rootScope.gotoView('/payment/confirmation');
                    })
                    .catch(function (err) {
                      $scope.submissionError = true;
                      $rootScope.$emit('pageLoaded');
                    });
                  break;
              }
            };

            /**
             * @return {Promise}
             */
            function submitBankAutopayDetails() {
              var preferencesObj = {
                account: {
                  token: $scope.serviceResponse.token
                },
                preferences: {
                  mailingAddress: $scope.serviceResponse.preferences.mailingAddress,
                  emailAddress: PaymentFlowFactory.getEmailAddress(),
                  payment: {
                    bankDraftDetails: {
                      bankName: 'Bank of America', // Needed for service side validation that then discards this value
                      accountNumber: PaymentFlowFactory.getAccountNumber(),
                      routingNumber: PaymentFlowFactory.getRoutingNumber(),
                      accountType: PaymentFlowFactory.getAccountType(),
                      bankAccountHolderName: PaymentFlowFactory.getAccountHolderName()
                    }
                  },
                  updatedPreferences: {
                    paymentMethod: 'BANKDRAFT',
                    billingMethod: PaymentFlowFactory.getBillingMethod().toUpperCase(),
                    paymentFrequency: 'RECURRING'
                  },
                  priorBillingNotifPrefCode: $scope.serviceResponse.preferences.priorBillingNotifPrefCode
                },
                TIPData: $rootScope.getTIPData('SetupRcrBankDraft', '/setBillingPreferences')
              };

              return $http.post(config.apiUrl + '/setBillingPreferences', preferencesObj);
            }

            /**
             * @return {Promise}
             */
            function submitCreditCardToCyberSource() {
              return $q(function (resolve, reject) {
                if ($scope.userSetData.encryptedPaymentData) {
                  return resolve($scope.userSetData.encryptedPaymentData);
                }
                var cardRequest = {
                  environment: config.env == 'PROD' ? config.env.toLowerCase() : 'test',
                  merchantId: config.merchantId,
                  transaction: {
                    merchantReferenceCode: $scope.userSetData.merchantReferenceCode.toString()
                  },
                  card: {
                    accountNumber: $scope.userSetData.creditCardDetails.lastFour.toString(),
                    expirationMonth: $scope.userSetData.creditCardDetails.month.toString(),
                    expirationYear: '20' + $scope.userSetData.creditCardDetails.year.toString(),
                    cvNumber: $scope.userSetData.creditCardDetails.cvn.toString()
                  },
                  billing: {
                    firstName: $scope.serviceResponse.identity.givenName,
                    lastName: $scope.serviceResponse.identity.familyName,
                    postalCode: "94043"
                  },
                  signature: $scope.userSetData.signature
                };
                cybersource.processCard(cardRequest, function (result) {
                  resolve($scope.userSetData.encryptedPaymentData = result.encryptedPaymentData);
                }, reject);
              });
            }

            /**
             *
             * @param {*} result
             * @return {Promise}
             */
            function doStk2(encryptedPaymentData) {
              var data = {
                account: {
                  token: $scope.serviceResponse.token
                },
                paymentFrequency: 'RCC',
                paymentAmount: 0,
                merchantReferenceCode: $scope.userSetData.merchantReferenceCode,
                encryptedPaymentData: encryptedPaymentData,
                enrollmentProcessNumber: $scope.userSetData.enrollmentProcessNumber,
                ccFirstName: $scope.userSetData.creditCardDetails.firstName,
                ccLastName: $scope.userSetData.creditCardDetails.firstName,

                accountHolderName: $scope.userSetData.creditCardDetails.firstName,
                billingMethod: $scope.userSetData.billingMethod && $scope.userSetData.billingMethod.toUpperCase(),
                preferences: {
                  emailAddress: $scope.serviceResponse.identity.email,
                  mailingAddress: $scope.userSetData.preferences.mailingAddress,
                  priorBillingNotifPrefCode: $scope.serviceResponse.preferences.priorBillingNotifPrefCode,
                  payment: {
                    bankDraftDetails: {
                      bankName: null,
                      accountNumber: null,
                      routingNumber: null,
                      accountType: null,
                    }
                  }
                },
                TIPData: $rootScope.getTIPData('SetupRcrCreditCard', '/sale')
              };
              return $http.post(config.apiUrl + '/sale', data);
            }


          }] // End of controller declaration
      }; // End of directive return object
    }); // End of directive function call
})();
