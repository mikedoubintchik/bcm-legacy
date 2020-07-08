/**
 * Directive for the payment flow billing method.
 *
 * @namespace Directives
 * @class autopayFlowBillingMethod
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.autopayFlowBillingMethod', [])
    .directive('autopayFlowBillingMethod', [
      function() {
        return {
          scope: {
            /**
             * @param {Object} userData
             * @param {Object} userData.preferences
             */
            balanceInfo: '=',
            userData: '='
          },
          restrict: 'E',
          templateUrl: 'partials/autopay-flow-billing-method.html',
          controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
            var vm = this;
            $scope.loc = $rootScope.loc;
            $scope.strictEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $scope.userData = PaymentFlowFactory.getUserSetData();
            $scope.paymentFlow = PaymentFlowFactory.getPaymentFlow();

            var billingMethodSelected = PaymentFlowFactory.getBillingMethod();
            if (billingMethodSelected) {
              $scope.billingMethodSelected = billingMethodSelected;
            }
            if (!billingMethodSelected) {
              if ($scope.balanceInfo.preferences.emailAddress) {
                $scope.userData.preferences.emailAddress = $scope.balanceInfo.preferences.emailAddress;
              }
              $scope.billingMethodSelected = 'email';
            }

          }]
        };
      }
    ]);
}());