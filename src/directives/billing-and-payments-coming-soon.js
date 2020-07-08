/**
 * Directive for the billing and payments coming soon.
 *
 * @namespace Directives
 * @class billingAndPaymentsComingSoon
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.billingAndPaymentsComingSoon', [])
    .directive('billingAndPaymentsComingSoon', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/billing-and-payments-coming-soon.html',
          scope: {
            /**
            *
            * @memberof billingAndPaymentsComingSoon
            * @member {String} title.
            */

          },
          controller: [
            '$scope',
            '$rootScope',
            function($scope, $rootScope) {
              $scope.loc = $rootScope.loc;
              $scope.goToDesktopBilling = function() {
                $rootScope.openInSecureBrowser('members/secure/account/billing/&qs=');
              };
            }
          ]
        };
      }
    ]);
}());
