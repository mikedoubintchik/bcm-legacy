(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowPaymentAmount', [])
    .directive('paymentFlowPaymentAmount', function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/payment-flow-payment-amount.html',
        controllerAs: 'totalAmntCtrl',
        scope: {
          billingInfo: '='
        },
        controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
          var vm = this;
          $scope.loc = $rootScope.loc;
          $scope.selectedPolicy = $rootScope.selectedPolicy;
          if ($scope.billingInfo.currentInvoice.minAmountDue === $scope.billingInfo.currentInvoice.totalDueAmount){
            $scope.minAmountDue = false;
          } else if ($scope.billingInfo.currentInvoice.minAmountDue === $scope.billingInfo.currentInvoice.balanceForwardAmount){
            $scope.minAmountDue = false;
          } else {
            $scope.minAmountDue = $scope.billingInfo.currentInvoice.minAmountDue > 0;
          }
          
          vm.available = true;

          if ($scope.billingInfo.isPaymentProcessing && $scope.billingInfo.currentInvoice.remainingBalance === 0) {
            vm.available = false;
          }
          if ($scope.billingInfo.preferences && $scope.billingInfo.preferences.isAutopay) {
            vm.available = false;
          }
          if (!$scope.billingInfo.currentInvoice.totalDueAmount) {
            vm.available = false;
          }
          if ($scope.billingInfo.reinstatementAmount > 0) {
            vm.available = true;
          }

          if (vm.available && $scope.billingInfo.isPaymentProcessing === true) {
            // have to coerce to string because label attr is string
            $scope.desiredPaymentAmount = $scope.billingInfo.currentInvoice.remainingBalance.toString();
          }

          if (vm.available && $scope.billingInfo.isPaymentProcessing === false) {
            $scope.desiredPaymentAmount = $scope.billingInfo.currentInvoice.totalDueAmount.toString();
          }

          if (vm.available && $scope.billingInfo.reinstatementAmount > 0) {
            $scope.desiredPaymentAmount = $scope.billingInfo.reinstatementAmount.toString();
          }

          $scope.padAmt = function(amt) {
            var amountDue = amt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'});
            return amountDue;
          };

          var desiredPaymentAmount = PaymentFlowFactory.getPaymentAmount();
          if (desiredPaymentAmount) {
            $scope.desiredPaymentAmount = desiredPaymentAmount;
          }

        }]
      };
    });
})();