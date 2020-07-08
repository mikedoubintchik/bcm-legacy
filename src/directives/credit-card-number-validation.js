/**
 * Directive for validating a credit card number based upon
 * specific rules related to length and format
 *
 * @namespace Directives
 * @class creditCardNumberValidation
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.creditCardNumberValidation', [])
  .directive('creditCardNumberValidation', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, $elem, $attrs) {
          // var inputCloseToMax = false;
          // var maxLength = $attrs.maxLength;
          // $elem.find('input').on('keyDown', function(ev) {
          //   if ()
          // });
          // $attrs.$observe('creditCardNumberValidation', function(value) {
          //   console.log(arguments);
          //   if (value.length === (maxLength - 1)) {
          //     inputCloseToMax;
          //   }
          // });
        }
      };
    }
  ]);
}());
