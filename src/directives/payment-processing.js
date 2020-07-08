/**
 * @description
 * Directive for when a payment is processing.
 *
 * @example
 * <payment-processing payment-date="dateScopeVar" payment-amount="amountScopeVar"></payment-processing>
 */
(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.directives.paymentProcessing', [])
    .directive('paymentProcessing', [
      function() {
        return {
          restrict: 'E',
          scope: {
            paymentAmount: '<',
            paymentDate: '<'
          },
          controller: [
            '$rootScope',
            '$scope',
            function($rootScope, $scope) {
              $scope.loc = $rootScope.loc;
            }
          ],
          templateUrl: 'partials/payment-processing.html'
        };
      }
    ]);
})();