(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowPaymentReceipt', [])
    .directive('paymentFlowPaymentReceipt', function() {
      return {
        restrict: 'E',
        replace: false,
        scope: {
          billingInfo: '='
        },
        controller: ['$scope', '$rootScope', 'PaymentFlowFactory', function($scope, $rootScope, PaymentFlowFactory) {
          $scope.loc = $rootScope.loc;
          $scope.userSetData = PaymentFlowFactory.getUserSetData();
          $scope.paymentFrequencyDisplayValue = /auto/.test($scope.userSetData.paymentFrequency) ? $scope.loc.BP_MONTHLY_AUTOPAY : $scope.loc.BP_ONE_TIME_PAYMENT;
          $scope.paymentMethodDisplayValue = /bank/.test($scope.userSetData.paymentMethod) ? $scope.loc.BP_BANK_DRAFT : $scope.loc.BP_CREDIT_CARD;
          $scope.accountTypeDisplayValue = $scope.userSetData.accountType === 'Checking' ? $scope.loc.BP_CHECKING : $scope.loc.SAVINGS;

          var billingMethod = PaymentFlowFactory.getBillingMethod();
          if (billingMethod === 'postal') {
            $scope.billingMethodDisplayValue = $scope.loc.BP_POSTAL_MAIL;
          }
          if (billingMethod === 'none') {
            $scope.billingMethodDisplayValue = $scope.loc.BP_DO_NOT_SEND_COPY_OF_BILL;
          }
          if (billingMethod === 'email') {
            $scope.billingMethodDisplayValue = $scope.loc.EMAIL;
          }
        }],
        templateUrl: 'partials/payment-flow-payment-receipt.html'
      }
    })
    .directive('paymentFlowReceiptRow', function() {
      return {
        restrict: 'E',
        replace: false,
        scope: {
          label: '@',
          value: '@'
        },
        templateUrl: 'partials/payment-flow-payment-receipt-row.html'
      }
    });
})();