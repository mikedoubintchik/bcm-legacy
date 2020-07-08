(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowAutopayPromo', [])
    .directive('paymentFlowAutopayPromo', function() {
      return {
        restrict: 'E',
        replace: false,
        controller: ['$scope', '$rootScope', 'PaymentFlowFactory', function($scope, $rootScope, PaymentFlowFactory) {
          $scope.paymentFrequencySelected = PaymentFlowFactory.getPaymentFrequency();
          $scope.hideAutopayPromo = /auto/i.test($scope.paymentFrequencySelected);
          $scope.gotoView = function(url) {
            PaymentFlowFactory.setPaymentFlow('autopay').setPaymentFrequency('autopay');
            return $rootScope.gotoView(url);
          }
        }],
        templateUrl: 'partials/payment-flow-autopay-promo.html'
      }
    });
})();