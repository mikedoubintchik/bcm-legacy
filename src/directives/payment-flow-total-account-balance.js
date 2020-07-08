/**
 * Directive for the payment flow total account balance.
 *
 * @namespace Directives
 * @class paymentFlowTotalBalance
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.paymentFlowTotalBalance', [])
  .directive('paymentFlowTotalBalance', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/payment-flow-total-account-balance.html',
        scope: {
          balanceInfo: '='
        },
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;

          $scope.getDollars = function(input) {
            if (!input) {
              return '';
            }
            var inputStr = input.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'});
            return inputStr.slice(1, inputStr.indexOf('.') + 1) || 0;
          };
          $scope.getCents = function(input) {
            if (!input) {
              return '';
            }
            var inputStr = input.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'});
            return inputStr.slice(inputStr.indexOf('.') + 1);
          };
        }]
      };
    }
  ]);
}());
