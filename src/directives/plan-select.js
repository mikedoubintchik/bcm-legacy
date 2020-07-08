/**
 * Directive for the plan select.
 *
 * @namespace Directives
 * @class planSelect
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.planSelect', [])
  .directive('planSelect', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/plan-select.html',
        scope: {
          planSelectDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'TransparencyFactory',
          function($scope, $rootScope, TransparencyFactory) {
            $scope.loc = $rootScope.loc;
            $scope.selectedPlan = $rootScope.selectedPlan;

            $scope.togglePlan = function () {
              $scope.expandedPlan = !$scope.expandedPlan;
            };

            $scope.selectPlan = function(plan){
              $scope.selectedPlan = plan;
              $rootScope.selectedUnauthenticatedPlanName = plan.name;
              $rootScope.selectedPlan = $scope.selectedPlan;
              TransparencyFactory.setSelectedPlan(plan);
              $rootScope.selectsPlan(plan);
              $scope.togglePlan();
            };

          }
        ]
      };
    }
  ]);
}());
