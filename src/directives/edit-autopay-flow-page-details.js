(function () {
  angular
    .module('blueconnect.mobile.directive.editAutopayFlowPageDetails', [])
    .directive('editAutopayFlowPageDetails', function () {
      return {
        scope: {
          serviceResponse: '<'
        },
        templateUrl: 'partials/edit-autopay-flow-page-details.html',
        controller: ['config', 'PaymentFlowFactory', '$http', '$q', '$rootScope', '$scope',
          function (config, PaymentFlowFactory, $http, $q, $rootScope, $scope) {
            $scope.userSetData = PaymentFlowFactory.getUserSetData();
            $scope.creditCardSignatureError = false;
            // Sets the scope variables and functions
            initializePage();

            /**
             * Initializing the page
             */
            function initializePage() {
              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;

              $scope.trackerInfo = {
                step: 'DETAILS'
              };

              // Defining page back behavior broadcasted from the header directive
              $scope.$on('PAGE_BACK', function () {
                if ($scope.editAutopayDetailsForm.bankDraftForm) {
                  saveBankDetails($scope.editAutopayDetailsForm);
                }
                $rootScope.gotoView('/edit-autopay-flow/method');
              });

              // Setting the localized string for the payment method
              $scope.localizedPaymentMethod = (
                PaymentFlowFactory.getPaymentMethod() === 'bankdraft' ?
                  $scope.loc.BP_BANK_DRAFT :
                  $scope.loc.BP_CREDIT_CARD
              );

              // Setting the localized string for the billing method to display
              var billingMethod = PaymentFlowFactory.getBillingMethod();
              if (billingMethod === 'none') {
                $scope.localizedBillingMethod = $scope.loc.BP_DO_NOT_SEND_COPY_OF_BILL;
              }
              if (billingMethod === 'email') {
                $scope.localizedBillingMethod = $scope.loc.EMAIL;
              }
            }
            // End of init function

            /**
             *
             * @param {*} formObj
             */
            $scope.validateEditAutopayDetails = function (formObj) {
              // Remove error message immediately after resubmission
              $scope.creditCardSignatureError = false;
              // Validate the form fields
              formObj.paymentFlowTermsConditions.acceptedAgreement.$setDirty();
              if (formObj.bankDraftForm) {
                setBankFormDirty(formObj);
              }
              if (formObj.creditCardDetailsForm) {
                setCreditFormDirty(formObj)
              }
              if (formObj.$invalid) {
                return;
              }

              // Save user inputs for bankdraft
              if ($scope.userSetData.paymentMethod === 'bankdraft') {
                saveBankDetails(formObj);
                $rootScope.gotoView('/edit-autopay-flow/review');
              }
              // Save user inputs for credit details
              if ($scope.userSetData.paymentMethod === 'creditcard') {
                postAndSaveCreditDetails(formObj)
                  .then(function () {
                    $rootScope.gotoView('/edit-autopay-flow/review');
                  })
                  .catch(function (error) {
                    $scope.creditCardSignatureError = true;
                    $rootScope.$emit('pageLoaded');
                  });
              }
            }

            /**
             *
             */
            function setBankFormDirty(formObj) {
              formObj.bankDraftForm.accountOwnersName.$setDirty();
              formObj.bankDraftForm.accountType.$setDirty();
              formObj.bankDraftForm.bankRoutingNumber.$setDirty();
              formObj.bankDraftForm.bankAccountNumber.$setDirty();
              formObj.bankDraftForm.confirmAccountNumber.$setDirty();
            }

            /**
             *
             */
            function setCreditFormDirty(formObj) {
              formObj.creditCardDetailsForm.creditCardNumber.$setDirty();
              formObj.creditCardDetailsForm.cvn.$setDirty();
              formObj.creditCardDetailsForm.firstName.$setDirty();
              formObj.creditCardDetailsForm.month.$setDirty();
              formObj.creditCardDetailsForm.year.$setDirty();
            }

            /**
             *
             * @param {Object} formObj
             * @return {Promise}
             */
            function postAndSaveCreditDetails(formObj) {
              $scope.creditCardSignatureError = false;
              $rootScope.$emit('pageLoading');
              var creditCardData = {
                account: {
                  token: $scope.serviceResponse.token
                },
                paymentFrequency: 'RCC',
                authAmount: 2, // this does not matter because they are not using this in the hashed signature
                emailAddress: $scope.serviceResponse.identity.email,
                firstName: $scope.serviceResponse.identity.givenName,
                lastName: $scope.serviceResponse.identity.familyName
              };
              return $q(function (resolve, reject) {
                $http.post(config.apiUrl + '/signature', creditCardData)
                  .then(function (response) {
                    PaymentFlowFactory.setSignature(response.data.signature);
                    PaymentFlowFactory.setMerchantReferenceCode(response.data.merchantReferenceCode);
                    PaymentFlowFactory.setEnrollmentProcessNumber(response.data.enrollmentProcessNumber);
                    resolve();
                  })
                  .catch(reject);
              });
            }

            /**
             *
             * @param {*} formObj
             */
            function saveBankDetails(formObj) {
              PaymentFlowFactory
                .setAccountHolderName(formObj.bankDraftForm.accountOwnersName.$modelValue)
                .setAccountType(formObj.bankDraftForm.accountType.$modelValue)
                .setRoutingNumber(formObj.bankDraftForm.bankRoutingNumber.$modelValue)
                .setAccountNumber(formObj.bankDraftForm.bankAccountNumber.$modelValue)
                .setConfirmedAccountNumber(formObj.bankDraftForm.confirmAccountNumber.$modelValue);
            }


          }]
      }
    });
})();
