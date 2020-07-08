/**
 * Directive for the total remaining balance when there's a
 * payment processing and the member isn't overdue
 *
 * @namespace Directives
 * @class totalRemainingBalance
 */
(function () {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.totalRemainingBalance', [])
    .directive('totalRemainingBalance', [
      function () {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/total-remaining-balance.html',
          controller: [
            '$rootScope',
            '$scope',
            function ($rootScope, $scope) {
              $scope.loc = $rootScope.loc;
            }
          ]
        };
      }
    ]);
}());
