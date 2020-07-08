(function () {
  angular
    .module('blueconnect.mobile.directive.editAutopayFlowPageMethod', [])
    .directive('editAutopayFlowPageMethod', function () {
      return {
        scope: {
          serviceResponse: '=?'
        },
        templateUrl: 'partials/edit-autopay-flow-page-method.html',
        controller: ['PaymentFlowFactory', '$rootScope', '$scope', '$window', function (PaymentFlowFactory, $rootScope, $scope, $window) {
          // aliasing functions to user in scope
          $scope.loc = $rootScope.loc;
          $scope.gotoView = $rootScope.gotoView;

          $scope.padAmt = function(amt) {
            var amount = amt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'});
            return amount;
          };

          //setting intial values from preferences
          if (!PaymentFlowFactory.getBillingMethod()) {
            PaymentFlowFactory.setBillingMethod($scope.serviceResponse.preferences.billingMethod.toLowerCase());
          }
          if (!PaymentFlowFactory.getEmailAddress()) {
            PaymentFlowFactory.setEmailAddress($scope.serviceResponse.preferences.emailAddress);
          }

          $scope.trackerInfo = {
            step: 'METHOD'
          };
          // setting initial radio values
          $scope.paymentFrequency = 'RECURRING',
            $scope.premiumSelected = 'TRUE';

          $scope.$on('PAGE_BACK', function () {
            $window.history.back();
          });

          $scope.validateEditAutopayMethod = function (formObj) {
            // validating the form
            formObj.premiumRadioSelected.$setDirty();
            formObj.paymentFlowPaymentMethodForm.desiredPaymentMethod.$setDirty();
            if (formObj.paymentFlowPaperlessAgreement) {
              formObj.paymentFlowPaperlessAgreement.acceptedAgreement.$setDirty();
            }

            if (formObj.$invalid) {
              return;
            }

            PaymentFlowFactory.setPaymentFrequency('autopay');

            // setting factory values
            PaymentFlowFactory.setPaymentMethod(formObj.paymentFlowPaymentMethodForm.desiredPaymentMethod.$modelValue);
            if (formObj.autopayFlowBillingMethod) {
              PaymentFlowFactory
                .setBillingMethod(formObj.autopayFlowBillingMethod.billingMethodSelected.$modelValue);
            }

            var billingMethod = PaymentFlowFactory.getBillingMethod();
            if (billingMethod === 'none') {
              $scope.localizedBillingMethod = $scope.loc.BP_DO_NOT_SEND_COPY_OF_BILL;
            }
            if (billingMethod === 'email') {
              $scope.localizedBillingMethod = $scope.loc.EMAIL;
            }

            // redirecting view
            $rootScope.gotoView('/edit-autopay-flow/details');
          };

        }]
      }
    });
})();
