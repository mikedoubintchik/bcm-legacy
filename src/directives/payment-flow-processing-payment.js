(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowProcessingPayment', [])
    .directive('paymentFlowProcessingPayment', function() {
      return {
        restrict: 'E',
        replace: false,
        controller: ['$scope', '$rootScope', 'PaymentFlowFactory', function($scope, $rootScope, PaymentFlowFactory) {
          $scope.userSetData = PaymentFlowFactory.getUserSetData();
          var todaysDate  = new Date();
          $scope.todayFormatted = (todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear();
        }],
        templateUrl: 'partials/payment-flow-processing-payment.html'
      }
    });
})();