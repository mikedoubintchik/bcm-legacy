/**
 * Directive for the payment flow payment method.
 *
 * @namespace Directives
 * @class paymentFlowPaymentMethodSelected
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.paymentFlowPaymentMethodSelected', [])
    .directive('paymentFlowPaymentMethodSelected', [
      function() {
        return {
          scope: {
            billingInfo: '=methodInfo'
          },
          restrict: 'E',
          templateUrl: 'partials/payment-flow-payment-method-selected.html',
          controller: ['$rootScope', '$scope', 'PaymentFlowFactory', function($rootScope, $scope, PaymentFlowFactory) {
            var vm = this;
            $scope.loc = $rootScope.loc;
            $scope.selectedPaymentAmount = PaymentFlowFactory.getPaymentAmount();
            if (!$scope.billingInfo.memberInReinstatement){
              $scope.totalAccountBalance = ($scope.selectedPaymentAmount == $scope.billingInfo.currentInvoice.totalDueAmount);
              $scope.minAmountDue = !$scope.totalAccountBalance && ($scope.selectedPaymentAmount == $scope.billingInfo.currentInvoice.minAmountDue);
              $scope.amountDue = (!$scope.totalAccountBalance && !$scope.minAmountDue); 
            }

            $scope.localizedPaymentFrequency = (
              /auto/.test(PaymentFlowFactory.getPaymentFrequency()) ?
              $scope.loc.BP_AUTOPAY :
              $scope.loc.BP_ONE_TIME_PAYMENT
            );

            $scope.localizedPaymentMethod = (
              PaymentFlowFactory.getPaymentMethod() === 'bankdraft' ?
                $scope.loc.BP_BANK_DRAFT :
                $scope.loc.BP_CREDIT_CARD
            );

            var billingMethod = PaymentFlowFactory.getBillingMethod();
            if (billingMethod === 'postal') {
              $scope.localizedBillingMethod = $scope.loc.BP_POSTAL_MAIL;
            }
            if (billingMethod === 'none') {
              $scope.localizedBillingMethod = $scope.loc.BP_DO_NOT_SEND_COPY_OF_BILL;
            }
            if (billingMethod === 'email') {
              $scope.localizedBillingMethod = $scope.loc.EMAIL;
            }

          }]
        };
      }
    ]);
}());