/**
 * @description
 * Directive for the payment flow title bars. A reusable title bar for payment flow.
 *
 * @param {string} title The string content for the title applied with one time string binding
 * @example
  <payment-flow-title-bar title="Payment Frequency"><payment-flow-title-bar>
  
 * @example 
  <payment-flow-title-bar title="{{loc.SOME_LOC_STRING}}"></payment-flow-title-bar>
 *@example
 *With the center attribute set to true you can center the text
  <payment-flow-title-bar center="true" title="{{loc.SOME_LOC_STRING}}"</payment-flow-title-bar>
 */
(function() {
  'use strict'
  angular
    .module('blueconnect.mobile.directives.paymentFlowTitleBar', [])
    .directive('paymentFlowTitleBar', [
      function() {
        return {
          restrict: 'E',
          template: '<h6>{{title}}</h6>',
          scope: {
            title: '@'
          },
          link: function(scope, elem, attr) {
            if(attr.center) {
              elem.addClass('justify-center');
            }
          }
        };
      }
    ]);
})();