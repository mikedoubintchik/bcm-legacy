/**
 * Directive for the payment flow tracker.
 *
 * @namespace Directives
 * @class paymentFlowTracker
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.paymentFlowPaymentFrequency', [])
    .directive('paymentFlowPaymentFrequency', [
      function() {
        return {
          scope: {
            balanceInfo: '='
          },
          restrict: 'E',
          templateUrl: 'partials/payment-flow-payment-frequency.html',
          controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
            var vm = this;
            $scope.loc = $rootScope.loc;
            $scope.frequencySelected = null;

            // defaults to squelch unreferenced property errors in the console
            $scope.balanceInfo = $scope.balanceInfo || {};

            $scope.changeBillingMethodToEmail = function(form) {
              form.$$parentForm.paymentFlowBillingMethodForm.billingMethodSelected = 'email';
            };

            var inReinstatement = $scope.balanceInfo.reinstateEligible === true && $scope.balanceInfo.reinstatementAmount > 0;

            //if the user is in autopay they come to the screen with only the autopay option showing and autopay automatically selected
            $scope.showAutoPay = (
              (
                // Displays when account balance > 0 and user is not outside of reinstatement period.
                $scope.balanceInfo.isPaymentProcessing ?
                $scope.balanceInfo.currentInvoice.remainingBalance > 0:
                $scope.balanceInfo.currentInvoice.totalDueAmount > 0
              )
              // doesn't show when user is in reinstatement, at all
              // doesn't show when user is a medicare member
              && !$scope.balanceInfo.memberInReinstatement && $scope.balanceInfo.policyMembership.enrollmentSourceSystemCode.toLowerCase() !== 'amisys'
            );

            $scope.showOneTimePayment = (
              (
                // Displays when account balance > 0 and user is not outside of reinstatement period.
                $scope.balanceInfo.isPaymentProcessing ?
                $scope.balanceInfo.currentInvoice.remainingBalance > 0:
                $scope.balanceInfo.currentInvoice.totalDueAmount > 0
              ) ||
              // can display when user is in reinstament,
              // but they have to be reinstatement eligible
              (
                $scope.balanceInfo.memberInReinstatement &&
                $scope.balanceInfo.reinstateEligible
              )
            );

            // if autopay is the only available option
            if ($scope.showAutoPay === true && $scope.showOneTimePayment === false) {
              $scope.frequencySelected = 'autopay';
            }

            // if one time payment is the only available option
            if ($scope.showAutoPay === false && $scope.showOneTimePayment === true) {
              $scope.frequencySelected = 'oneTimePayment';
            }

            var desiredFrequency = PaymentFlowFactory.getPaymentFrequency();
            if (desiredFrequency) {
              console.log('payment flow present');
              console.log(desiredFrequency);
              $scope.frequencySelected = /auto/i.test(desiredFrequency) ? 'autopay': 'oneTimePayment';
            }

            if ($scope.showAutoPay && $scope.showOneTimePayment) {
              var desiredPaymentFlow = PaymentFlowFactory.getPaymentFlow();
              if (!desiredPaymentFlow) {
                return console.warn('Probably caused by a refresh, possibly an error, but no payment flow was available!');
              }
              $scope.frequencySelected = /auto/i.test(desiredPaymentFlow) ? 'autopay': 'oneTimePayment';
            }

          }]
        };
      }
    ]);
}());
