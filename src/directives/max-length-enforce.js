/**
 * Directive for preventing user input in a field once maxlength has been reached
 *
 * @namespace Directives
 * @class maxLengthEnforce
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.maxLengthEnforce', [])
  .directive('maxLengthEnforce', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, $elem, $attrs) {
          $elem.on('keydown', function(ev) {
            var value = $elem.find('input').val();
            if (
              (ev.key !== 'Backspace' && ev.key !== 'Delete') &&
              value.length === $attrs.maxLength - 0
            ) {
              ev.preventDefault();
            }
          });
        }
      };
    }
  ]);
}());
