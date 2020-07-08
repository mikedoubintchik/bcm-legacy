(function () {
  angular
      .module('blueconnect.mobile.directives.billingInvoiceHistoryFilterRibbon', [])
      .directive('billingInvoiceHistoryFilterRibbon', function () {
        return {
          restrict: 'E',
          scope: {
            resultsCount: '='
          },
          templateUrl: 'partials/billing-invoice-history/billing-invoice-history-filter-ribbon.html',
          controller: ['$rootScope', '$scope', 'BillingInvoiceHistoryFactory', function ($rootScope, $scope, BillingInvoiceHistoryFactory) {
            $scope.loc = $rootScope.loc;
            $scope.isMedicareSSA = BillingInvoiceHistoryFactory.getMedicareSSAValue();

            $scope.resetFilter = function(){
              BillingInvoiceHistoryFactory.resetFilter();
              $rootScope.gotoView('billing-invoice-history');
            };

            var transType = BillingInvoiceHistoryFactory.getHistoryType();
            switch (transType) {
              case 'P':
                $scope.filterTransType = $rootScope.loc.BP_PAYMENTS;
                break;
              case 'I':
                $scope.filterTransType = $rootScope.loc.BP_INVOICES;
                break;
              default:
                $scope.filterTransType = $rootScope.loc.BP_PAYMENT_INVOICES;
            }

            var currentSpan = BillingInvoiceHistoryFactory.getTimeSpan().toString();

            switch (currentSpan) {
              case '3':
                $scope.resultsCountText = $rootScope.loc.BP_LAST_3_MONTHS;
                break;
              case '6':
                $scope.resultsCountText = $rootScope.loc.BP_LAST_6_MONTHS;
                break;
              case '12':
                $scope.resultsCountText = $rootScope.loc.BP_LAST_12_MONTHS;
                break;
              case '24':
                $scope.resultsCountText = $rootScope.loc.BP_LAST_24_MONTHS;
                break;
              case '0':
                $scope.resultsCountText = $rootScope.loc.BP_LAST_YEARS_PLAN;
                break;
              default:
                $scope.resultsCountText = (moment(BillingInvoiceHistoryFactory.getStartDate()).format('MMMM YYYY') + ' - ' + moment(BillingInvoiceHistoryFactory.getEndDate()).format('MMMM YYYY'));
            }

          }]
        };
      })
})();