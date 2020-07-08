/**
 * Directive for a id card details
 *
 * @namespace Directives
 * @class idCardDetails
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCardPlanDetails', [])
    .directive('idCardPlanDetails', [
      function () {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/id-card-plan-details.html',
          scope: {
            idCardPolicyDetails: '='
          },
          controller: [
            '$scope',
            '$rootScope',
            function ($scope, $rootScope) {
              $scope.loc = $rootScope.loc;
            }
          ]
        };
      }
    ]);
}());