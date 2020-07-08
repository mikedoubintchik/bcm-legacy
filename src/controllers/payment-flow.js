(function() {
  angular
    .module('blueconnect.mobile.controllers.paymentFlow', [
      'bcbsnc.cloud.services.page'
    ])
    .controller('PaymentFlowController', [
      '$http',
      '$location',
      '$rootScope',
      '$routeParams',
      '$scope',
      '$timeout',
      '$window',
      'config',
      'restService',
      'PaymentFlowFactory',
      function($http, $location, $rootScope, $routeParams, $scope, $timeout, $window, config, restService, PaymentFlowFactory) {
        // controls the current loaded page
        $scope.step = $routeParams.step;

        // hide the navbar
        $rootScope.showNav = false;

        // hide the policy select dropdown
        $rootScope.showPolicySelect = false;

        // default the loc object to avoid ReferenceErrors later
        $scope.loc = $rootScope.loc || {};

        // default the navbar details to avoid unref
        $scope.navbarDetails = {};

        // show the back button
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;

        $scope.userData = PaymentFlowFactory.getUserSetData();

        // loading / processing
        $scope.paymentInProgress = false;

        var routingPages = [
          '/billing',
          '/payment/method',
          '/payment/details',
          '/payment/review',
          '/payment/confirmation'
        ];

        // if the user loads the review page but already has a confirmation code
        // android fix for users hitting android back button from confirmation
        if ($scope.step === 'review' && PaymentFlowFactory.getConfirmationCode()) {
          PaymentFlowFactory.reset();
          $rootScope.gotoView('/billing');
        }

        // confirmation page-specific logic
        if ($scope.step === 'confirmation') {
          $rootScope.showNav = true;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
          $rootScope.pageTitle = PaymentFlowFactory.getUserSetData().paymentErrorCode > 100 ? $scope.loc.BP_UNSUCCESSFUL : $scope.loc.BP_HEADER_PAYMENT_CONFIRMATION;

          // hitting back from exit of payment flow to another page after data has been cleared
          if (PaymentFlowFactory.getPaymentFrequency() === null) {
            $rootScope.gotoView('/billing');
          }

        }
        // all other pages (method, details, review)
        else {
          $scope.navbarDetails = {
            leftNavButton: {
              icon: 'back'
            },
            onLeftClick: goToPreviousPage,
            title: getNavbarHeader(),
            openClearCardModal: null,
            cancelModalObj: {
              title: $scope.loc.BP_HEADER_ARE_YOU_SURE,
              body: $scope.loc.BP_EDIT_PAYMENT_REENTER_DETAILS,
              cancelButton: {
                title: $scope.loc.BP_CONTINUE_TO_MAKE_PAYMENT
              },
              confirmButton: {
                color: 'blue',
                title: $scope.loc.BP_EDIT_PAYMENT_INFO
              }
            },
            // passed into cancel modal for the nav bar back button
            confirmCancelModal: function() {
              PaymentFlowFactory.resetCreditCardDetails();
              $rootScope.gotoView('/payment/details');
            }
          };

        }
        if (!$rootScope.loc || !Object.keys($scope.loc).length) {
          $rootScope.loc = {};
          $rootScope.$emit('pageNeedsLocale');
          $rootScope.$on('localeRetrieved', function(ev, data) {
            $scope.loc = $rootScope.loc;
            $scope.navbarDetails.title = getNavbarHeader()
          });
        }

        var query = {
          policyIndex: $rootScope.policyIndex,
          policyEffectiveDate : $rootScope.selectedPolicy.effectiveDate,
          policyExpirationDate : $rootScope.selectedPolicy.expirationDate,
          policyExternalId : $rootScope.selectedPolicy.externalId
        };

        // start loading the page
        $rootScope.$emit('pageLoading');
        restService
          .getPageData(
            restService.devices.MOBILE,
            'payment-flow',
            $rootScope.language,
            query
          )
          .then(function(paymentFlowResponse) {
            $rootScope.$emit('pageLoaded');
            $scope.billingInfo = paymentFlowResponse;
            $rootScope.billingTrackStates($scope.step, $scope.billingInfo);
          })
          .catch(function(error, status) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
          });

        $scope.methodValidateForm = function(formObj) {
          // if billing method is present, will not be present once
          // user has already signed up for paperless billing
          if (formObj.paymentFlowBillingMethodForm) {
            formObj.paymentFlowBillingMethodForm.$setDirty();

            // user has selected email billing (paperless)
            if (formObj.paymentFlowBillingMethodForm.memberEmail) {
              formObj.paymentFlowBillingMethodForm.memberEmail.$setDirty();
            }

            // user has selected postal billing
            if (formObj.paymentFlowBillingMethodForm.billingMethodSelected.$modelValue === 'postal') {
              [
                formObj.paymentFlowBillingMethodForm.streetAddress,
                formObj.paymentFlowBillingMethodForm.city,
                formObj.paymentFlowBillingMethodForm.state,
                formObj.paymentFlowBillingMethodForm.zipcode
              ].map(function(input) {
                input.$setDirty();
              });
            }
          }

          // paperless agreement input logic
          if (formObj.paymentFlowPaperlessAgreement && formObj.paymentFlowPaperlessAgreement.acceptedAgreement) {
            formObj.paymentFlowPaperlessAgreement.acceptedAgreement.$setDirty();
          }

          formObj.paymentFlowPaymentMethodForm.desiredPaymentMethod.$setDirty();

          // payment amount input logic
          if (formObj.paymentFlowPaymentAmountForm) {
            formObj.paymentFlowPaymentAmountForm.desiredPaymentAmount.$setDirty();
          }

          // payment frequency input logic
          if (formObj.paymentFlowPaymentFrequencyForm) {
            formObj.paymentFlowPaymentFrequencyForm.frequencySelected.$setDirty();
          }

          // if the form is invalid, do not proceed
          if (formObj.$invalid) {
            //console.log(formObj);
            return console.warn('form is invalid, cannot proceed');
          }

          methodFormSetters(formObj);

          $rootScope.gotoView('/payment/details');
          $scope.navbarDetails.title = getNavbarHeader();
        };

        function methodFormSetters(formObj) {
          // set the payment amount
          if (formObj.paymentFlowPaymentAmountForm) {
            PaymentFlowFactory
              .setPaymentAmount(formObj.paymentFlowPaymentAmountForm.desiredPaymentAmount.$modelValue);
          }

          // set the payment frequency, also the flow
          if (formObj.paymentFlowPaymentFrequencyForm) {
            PaymentFlowFactory.setPaymentFrequency(formObj.paymentFlowPaymentFrequencyForm.frequencySelected.$modelValue);
            PaymentFlowFactory.setPaymentFlow(formObj.paymentFlowPaymentFrequencyForm.frequencySelected.$modelValue);
          }


          // error checking for if ng-if removed this form
          if (formObj.paymentFlowBillingMethodForm) {
            // set the billing method
            PaymentFlowFactory
              .setBillingMethod(formObj.paymentFlowBillingMethodForm.billingMethodSelected.$modelValue);
          } else {
              //if medicare then we wont have a paymentFlowBillingMethodForm
              PaymentFlowFactory.setBillingMethod('postal');
          }

          // set the payment method
          PaymentFlowFactory
            .setPaymentMethod(formObj.paymentFlowPaymentMethodForm.desiredPaymentMethod.$modelValue);

        }

        $scope.detailsValidateForm = function(detailsFormObj) {
          var bankDraftForm = detailsFormObj.bankDraftForm;
          var creditCardDetailsForm = detailsFormObj.creditCardDetailsForm;

          if (bankDraftForm) {
            [
              bankDraftForm.accountOwnersName,
              bankDraftForm.bankRoutingNumber,
              bankDraftForm.accountType,
              bankDraftForm.bankAccountNumber,
              bankDraftForm.confirmAccountNumber,
            ]
              .forEach(function(ctrl) {
                if (!ctrl) {
                  return console.warn('That control does not exist!');
                }
                ctrl.$setDirty();
              });
            if (detailsFormObj.$valid) {
              $rootScope.gotoView('/payment/review');
            } else {
              detailsFormObj.$setDirty();
            }
          }
          if (creditCardDetailsForm) {
            [
              creditCardDetailsForm.firstName,
              creditCardDetailsForm.creditCardNumber,
              creditCardDetailsForm.month,
              creditCardDetailsForm.year,
              creditCardDetailsForm.cvn,
            ]
              .forEach(function(ctrl) {
                if (!ctrl) {
                  return console.warn('That control does not exist!');
                }
                ctrl.$setDirty();
              });

            var userPaymentData = PaymentFlowFactory.getUserSetData();
            var userIdentity = $scope.billingInfo.userIdentity;
            var data = {
              account: {
                token: $scope.billingInfo.token
              },
              paymentFrequency: userPaymentData.paymentFrequency === 'autopay' ? 'RCC' : 'DIRECTBILL',
              authAmount: 2, // this does not matter because they are not using this in the hashed signature
              firstName: userIdentity.givenName,
              lastName: userIdentity.familyName
            };
            if (userIdentity.email) {
              data.emailAddress = userIdentity.email;
            }
            //console.log('data:: ' + JSON.stringify(data));
            var sig = $http.post(config.apiUrl + '/signature', data)
              .then(function(response) {
                //console.log('signature response:: ' + JSON.stringify(response));
                userPaymentData.signature = response.data.signature;
                userPaymentData.merchantReferenceCode = response.data.merchantReferenceCode;
                userPaymentData.enrollmentProcessNumber = response.data.enrollmentProcessNumber;
                if (detailsFormObj.$valid) {
                  $rootScope.gotoView('/payment/review');
                }
              })
              .catch(function(error) {
                detailsFormObj.paymentError.$setDirty();
                $scope.$digest();
                //console.log('Error getting signature', JSON.stringify(error));
              });
          }

          detailsFormObj.paymentFlowTermsConditions.acceptedAgreement.$setDirty();

        };

        /**
         * @description This posts to the endpoint in the Node billing service that
         */
        $scope.reviewValidateForm = function(paymentFlowReviewForm) {
          var userPaymentData = PaymentFlowFactory.getUserSetData();
          var userIdentity = $scope.billingInfo.userIdentity;
          var paymentError = false;
          $scope.paymentInProgress = true;
          //console.log('userPaymentData::: ' + JSON.stringify(userPaymentData));

          if (userPaymentData.paymentMethod === 'bankdraft') {
            var data = {
              account: {
                token: $scope.billingInfo.token
              },
              paymentAmount: PaymentFlowFactory.getPaymentAmount().toString(),
              accountHolderName: userPaymentData.accountHolderName,
              paymentFrequency: userPaymentData.paymentFrequency === 'autopay' ? 'RBD' : 'DIRECTBILL',
              billingMethod: userPaymentData.billingMethod && userPaymentData.billingMethod.toUpperCase(),
              preferences: {
                mailingAddress: userPaymentData.preferences.mailingAddress,
                priorBillingNotifPrefCode: $scope.billingInfo.preferences.priorBillingNotifPrefCode,
                payment: {
                  bankDraftDetails: {
                    bankName: userPaymentData.bankName,
                    accountNumber: userPaymentData.accountNumber,
                    routingNumber: userPaymentData.routingNumber,
                    accountType: userPaymentData.accountType,
                  }
                }
              },
              TIPData: $rootScope.getTIPData('OneTimeBankDraft', '/bankdraft')
            };
            if (userPaymentData.preferences.emailAddress) {
              data.preferences.emailAddress = userPaymentData.preferences.emailAddress;
            }
            $http.post(config.apiUrl + '/bankdraft', data)
              .then(function(response) {
                $scope.paymentInProgress = false;
                if (response.data.confirmationCode == null) {
                  paymentFlowReviewForm.$setDirty();
                  $scope.$digest();
                } else {
                  userPaymentData.paymentErrorCode = 100;
                  userPaymentData.successConfirmationCode = response.data.confirmationCode;
                  $rootScope.gotoView('/payment/confirmation');
                }
              })
              .catch(function() {
                //console.warn('Error posting payment', error)
                paymentFlowReviewForm.$setDirty();
                $scope.paymentInProgress = false;
                $scope.$digest();
                paymentError = true;
              });
          } else {
            //It is credit card
            //console.log('userpayment::: ' + JSON.stringify(userPaymentData));
            var cardRequest = {
              environment: config.env == 'PROD' ? config.env.toLowerCase() : 'test',
              merchantId: config.merchantId,
              transaction: {
                merchantReferenceCode: userPaymentData.merchantReferenceCode.toString()
              },
              card: {
                accountNumber: userPaymentData.creditCardDetails.lastFour.toString(),
                expirationMonth: userPaymentData.creditCardDetails.month.toString(),
                expirationYear: '20' + userPaymentData.creditCardDetails.year.toString(),
                cvNumber: userPaymentData.creditCardDetails.cvn.toString()
              },
              billing: {
                firstName: userIdentity.givenName,
                lastName: userIdentity.familyName,
                postalCode: "94043"
              },
              signature: userPaymentData.signature
            };

            var cc = cybersource
              .processCard(
                cardRequest,
                function(result) {
                  paymentError = false;
                  doStk2(result);
                },
                function() {
                  paymentFlowReviewForm.$setDirty();
                  $scope.paymentInProgress = false;
                  $scope.$digest();
                }
              );

            // eslint-disable-next-line no-inner-declarations
            function doStk2(result) {
              var data = {
                account: {
                  token: $scope.billingInfo.token
                },
                paymentFrequency: userPaymentData.paymentFrequency === 'autopay' ? 'RCC' : 'DIRECTBILL',
                paymentAmount: Number(PaymentFlowFactory.getPaymentAmount()),
                merchantReferenceCode: userPaymentData.merchantReferenceCode,
                encryptedPaymentData: result.encryptedPaymentData,
                enrollmentProcessNumber: userPaymentData.enrollmentProcessNumber,
                ccFirstName: userPaymentData.creditCardDetails.firstName,
                ccLastName: userPaymentData.creditCardDetails.lastName,

                accountHolderName: userPaymentData.accountHolderName,
                billingMethod: userPaymentData.billingMethod && userPaymentData.billingMethod.toUpperCase(),
                preferences: {
                  mailingAddress: userPaymentData.preferences.mailingAddress,
                  priorBillingNotifPrefCode: $scope.billingInfo.preferences.priorBillingNotifPrefCode,
                  payment: {
                    bankDraftDetails: {
                      bankName: null,
                      accountNumber: null,
                      routingNumber: null,
                      accountType: null,
                      bankAccountHolderName: userPaymentData.accountHolderName ||
                      ( userPaymentData.creditCardDetails.firstName + ' ' + userPaymentData.creditCardDetails.lastName )
                    }
                  }
                },
                TIPData: $rootScope.getTIPData('OneTimeCreditCardPmt', '/sale')
              };

              if (userIdentity.email) {
                data.preferences.emailAddress= userIdentity.email;
              }

              // then do stk2
              $http
                .post(config.apiUrl + '/sale', data)
                .then(function(response) {
                  userPaymentData.paymentErrorCode = response.data.statusCode;
                  userPaymentData.successConfirmationCode = response.data.merchantReferenceCode;
                  $scope.paymentInProgress = false;
                  $rootScope.gotoView('/payment/confirmation');
                })
                .catch(function() {
                  paymentFlowReviewForm.$setDirty();
                  $scope.paymentInProgress = false;
                  $scope.$digest();
                });
            }
          }
        };

        //TODO rename function to something more apt
        $scope.confirmationValidateForm = function() {
          PaymentFlowFactory.reset();
          $rootScope.gotoView('/billing');
        };

        function goToPreviousPage() {
          if ($location.$$url === '/payment/review' && PaymentFlowFactory.getUserSetData().paymentMethod === 'creditcard') {
            return $scope.navbarDetails.openClearCardModal();
          }
          var paymentMethod = PaymentFlowFactory.getPaymentMethod();
          var currentViewIndex = routingPages.indexOf($location.$$url);
          var previousView = routingPages[currentViewIndex - 1];
          var nextView = routingPages[currentViewIndex + 1];
          if (paymentMethod === 'creditcard') {
            $rootScope.$emit('openPaymentFlowModal:previousPageCreditCardConfirm');
            $rootScope.gotoView(previousView);
          } else {
            $rootScope.gotoView(previousView);
          }
          // on exit of payment flow from method page
          if (previousView === routingPages[0]) {
            //console.log('resetting payment info');
            PaymentFlowFactory.reset();
          }
        }

        function getNavbarHeader() {
          if (!$rootScope.loc || !Object.keys($rootScope.loc).length) {
            return '';
          }
          var headers = {
            method: $rootScope.loc.BP_HEADER_PAYMENT_METHOD,
            details: $rootScope.loc.BP_HEADER_PAYMENT_DETAILS,
            review: $rootScope.loc.BP_HEADER_PAYMENT_REVIEW,
            confirmation: PaymentFlowFactory.getUserSetData().paymentErrorCode ? $rootScope.loc.BP_UNSUCCESSFUL : $rootScope.loc.BP_HEADER_PAYMENT_CONFIRMATION
          };
          return headers[$scope.step];
        }
      }])
})();