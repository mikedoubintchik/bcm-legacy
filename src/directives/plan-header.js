/**
 * Directive for the static blue plan header (for find doctor).
 *
 * @namespace Directives
 * @class planHeader
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.planHeader', [])
    .directive('planHeader', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/plan-header.html',
          scope: false,
          controller: [
            '$scope',
            '$rootScope',
            'TransparencyFactory',
            function($scope, $rootScope, TransparencyFactory) {
              if (!$rootScope.loggedIn) {
                $rootScope.getInternalLocale();
              }
              $scope.loc = $rootScope.loc;
              $scope.selectedPlan = TransparencyFactory.getSelectedPlan();
            }
          ]
        };
      }
    ]);
}());
