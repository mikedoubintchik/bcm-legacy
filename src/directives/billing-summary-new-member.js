/**
 * @description
 * Directive to show new Members appreciation for choosing BCBSNC as well as
 * information to show that no invoice has been generated for them.
 *
 * @example
 * <billing-summary-new-member></billing-summary-new-member>
 */
(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.directives.billingSummaryNewMember', [])
    .directive('billingSummaryNewMember', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          scope: {
            planName: '=planName'
          },
          controller: [
            '$rootScope',
            '$scope',
            function($rootScope, $scope) {
              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;
            }
          ],
          templateUrl: 'partials/billing-summary-new-member.html'
        };
      }
    ]);
})();