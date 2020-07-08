(function() {
  angular
    .module('blueconnect.mobile.directives.billingInvoiceHistoryNoInvoices', [])
    .directive('noInvoicesMessage', function() {
      return {
        scope: true,
        controller: ['$rootScope', '$routeParams', '$scope', function($rootScope, $routeParams, $scope) {
          $scope.loc = $rootScope.loc || {};
          $scope.searchContext = $routeParams.search;
        }],
        templateUrl: 'partials/billing-invoice-history/no-invoices-message.html'
      };
    });
})();
