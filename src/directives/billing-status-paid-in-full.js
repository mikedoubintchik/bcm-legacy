/**
 * @description
 * Directive to show a Member that their policy is paid in full.
 *
 * @example
 * <billing-status-paid-in-full></billing-status-paid-in-full>
 */
(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.directives.billingStatusPaidInFull', [])
    .directive('billingStatusPaidInFull', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          controller: [
            '$rootScope',
            '$scope',
            function($rootScope, $scope) {
              $scope.loc = $rootScope.loc;
            }
          ],
          templateUrl: 'partials/billing-status-paid-in-full.html'
        };
      }
    ]);
})();