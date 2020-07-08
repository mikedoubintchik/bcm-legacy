(function() {
  angular
    .module('blueconnect.mobile.directives.invoicePayments')
    .directive('paymentSuccess', function() {
      return {
        templateUrl: 'partials/payment-success.html',
        scope: {
          paymentAmount: '<',
          paymentDate: '<'
        },
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
          $scope.moment = moment;
        }] 
      };
    });
})();