/**
 * Directive for the fund balance view on benefits page.
 *
 * @namespace Directives
 * @class fundBalance
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.fundData', [])
  .directive('fundData', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/fund-data.html',
        scope: {
          /**
          * Display information for the fund page.
          *
          * @memberof fundBalance
          * @member {Object} fundBalanceDetails
          */
          funds: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'config',
          'adobeService',
          function($rootScope, $scope, config, adobeService) {
            $scope.loc = $rootScope.loc;

            $scope.goToHEQ = function() {
              return $rootScope.openInSecureBrowser('appsso:healthequity');
            };

          }
        ]
      };
    }
  ]);
}());
