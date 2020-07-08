(function() {
  angular
    .module('blueconnect.mobile.directives.invoicePayments', [])
    .directive('invoicePayments', function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/invoice-payments.html',
        scope: {
          payment: '<?'
        },
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
          $scope.moment = moment;
        }]
      };
    });
})();