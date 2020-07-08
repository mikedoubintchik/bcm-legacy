/**
 * Directive for the billingHistoryUnderstandInvoice.
 *
 * @namespace Directives
 * @class billingHistoryUnderstandInvoice
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.billingHistoryUnderstandInvoice', [])
      .directive('billingHistoryUnderstandInvoice', [
        function () {
          return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/billing-history-understand-invoice.html',
            scope: {

            },
            controller: [
              '$scope',
              '$rootScope',
              'BillingInvoiceHistoryFactory', '$location', '$anchorScroll',
              function ($scope, $rootScope, BillingInvoiceHistoryFactory, $location, $anchorScroll) {
                $scope.loc = $rootScope.loc;
                $scope.gotoView = $rootScope.gotoView;

                $scope.gotoAnchor = function(divName) {
                  // set the location.hash to the id of the element you wish to scroll to.
                  $location.hash(divName);
                  // call $anchorScroll()
                  $anchorScroll();
                };

              }
            ]
          };
        }
      ]);
}());
