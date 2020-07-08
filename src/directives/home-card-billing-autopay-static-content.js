/**
 * @description
 * Directive for Members set up on AutoPay using BlueConnect Mobile before we release
 * features for AutoPay Members.
 */
(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.directives.homeCardBillingAutopayStaticContent', [])
    .directive('homeCardBillingAutopayStaticContent', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/home-card-billing-autopay-static-content.html'
        };
      }
    ]);
})();