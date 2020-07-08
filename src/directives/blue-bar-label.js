/**
 * Directive for a blue bar label.
 *
 * @namespace Directives
 * @class blueBarLabel
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.blueBarLabel', [])
  .directive('blueBarLabel', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/blue-bar-label.html',
        scope: {
          /**
          * The title of the blue bar label.
          *
          * @memberof blueBarLabel
          * @member {String} title
          */
          title: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.trackAction = $rootScope.trackAction;
          }
        ]
      };
    }
  ]);
}());
