'use strict';
/**
 * Takes a parameter value as a boolean for whether the checkbox is checked or not
 */
(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowCheckbox', [])
    .directive('pfCheckbox', function() {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/payment-flow-checkbox.html',
        scope: {
          value: '='
        },
        controller: ['$scope', function($scope) {
          if($scope.value === undefined) {
            $scope.value = false;
          }
          $scope.toggleCheckbox = function() {
            $scope.value = !$scope.value;
          };
        }]
      }
    });
})();