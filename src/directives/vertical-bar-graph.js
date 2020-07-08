/**
 * Directive for a vertical bar graph.
 *
 * @namespace Directives
 * @class verticalBarGraph
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.verticalBarGraph', [])
  .directive('verticalBarGraph', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/vertical-bar-graph.html',
        scope: {
          /**
          * Values to display in the graph.
          *
          * @memberof verticalBarGraph
          * @member {Object} graphValues
          */
          graphValues: '=',

          /**
          * Optional height.
          *
          * @memberof verticalBarGraph
          * @member {Object} height
          */
          graphHeight: '@'
        },
        controller: [
          '$scope',
          function($scope) {
            $scope.graphHeight = $scope.graphHeight || 6;
          }
        ]
      };
    }
  ]);
}());
