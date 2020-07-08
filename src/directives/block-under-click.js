/**
 * @description
 * Directive for blocking an under click, ie when an element is on top of another
 * element with a ng-click directive underneath it still receiving the click.
 *
 */
(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.directives.blockUnderClick', [])
    .directive('blockUnderClick', [
      function() {
        return {
          restrict: 'A',
          link: function($scope, $elem, $attrs) {
            $elem.on('click', function(ev) {
              return false;
            });
          }
        };
      }
    ]);
})();