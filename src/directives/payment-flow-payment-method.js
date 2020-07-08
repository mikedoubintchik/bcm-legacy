/**
 * Directive for the payment flow payment method.
 *
 * @namespace Directives
 * @class paymentFlowPaymentMethod
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.paymentFlowPaymentMethod', [])
    .directive('paymentFlowPaymentMethod', [
      function() {
        return {
          scope: {
            methodInfo: '='
          },
          restrict: 'E',
          templateUrl: 'partials/payment-flow-payment-method.html',
          controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
            var vm = this;
            $scope.loc = $rootScope.loc;
            $scope.paymentMethod = null;

            var desiredPaymentMethod = PaymentFlowFactory.getPaymentMethod();
            if (desiredPaymentMethod) {
              $scope.desiredPaymentMethod = desiredPaymentMethod;
            }
          }]
        };
      }
    ]);
}());