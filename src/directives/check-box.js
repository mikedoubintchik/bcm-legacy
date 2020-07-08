/**
 * Directive for the check box element.
 *
 * @namespace Directives
 * @class checkBox
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.checkBox', [])
  .directive('checkBox', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/check-box.html',
        scope: {
          /**
          *
          * @memberof checkBox
          * @member {boolean} model value to determine if checkbox is on or off.
          */
          model : '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
          }
        ]
      };
    }
  ]);
}());
