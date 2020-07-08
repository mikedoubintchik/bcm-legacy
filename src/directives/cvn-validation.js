/**
 * Directive for validating a CVN number for a credit card based upon
 * specific rules related to length and format
 *
 * @namespace Directives
 * @class cvnValidation
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.cvnValidation', [])
  .directive('cvnValidation', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, $elem, $attrs) {
          $elem.find('input').on('keydown', function(ev) {
            if (ev.key === 'Backspace') {
              return true;
            }
            if (this.value.length >= 4) {
              return false;
            }
          });
        }
      };
    }
  ]);
}());
