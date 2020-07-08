(function() {
  angular
    .module('blueconnect.mobile.directives.invoiceHistoryCard', [])
    .directive('invoiceHistoryCard', function() {
      return {
        restrict: 'E',
        scope: {
          invoice: '<'
        },
        templateUrl: 'partials/billing-invoice-history/invoice-history-card.html',
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc || {};
        }]
      };
    });
})();
