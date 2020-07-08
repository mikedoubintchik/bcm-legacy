(function() {
  angular
    .module('blueconnect.mobile.directives.editAutopayFlowPaymentReceipt', [])
    .directive('editAutopayFlowPaymentReceipt', function() {
      return {
        restrict: 'E',
        replace: false,
        scope: {
          serviceResponse: '='
        },
        controller: ['$scope', '$rootScope', 'PaymentFlowFactory', function($scope, $rootScope, PaymentFlowFactory) {
          $scope.loc = $rootScope.loc;
          $scope.userSetData = PaymentFlowFactory.getUserSetData();
          $scope.paymentFrequencyDisplayValue = $scope.loc.BP_AUTOPAY;
          $scope.paymentMethodDisplayValue = /bank/.test($scope.userSetData.paymentMethod) ? $scope.loc.BP_BANK_DRAFT : $scope.loc.BP_CREDIT_CARD;
          $scope.accountTypeDisplayValue = $scope.userSetData.accountType === 'Checking' ? $scope.loc.BP_CHECKING : $scope.loc.SAVINGS;
          $scope.localizedBillingMethod = (
              PaymentFlowFactory.getBillingMethod() === 'none' ?
                  $scope.loc.BP_DO_NOT_SEND_COPY_OF_BILL :
                  $scope.loc.EMAIL
          );

        }],
        templateUrl: 'partials/edit-autopay-flow-payment-receipt.html'
      }
    })
})();