/**
 * Directive for the payment flow bottom bar.
 *
 * @namespace Directives
 * @class paymentFlowHelpShare
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.paymentFlowHelpShare', [])
      .directive('paymentFlowHelpShare', [
        function () {
          return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/payment-flow-help-share.html',
            scope: {
              /**
               *
               * @memberof paymentFlowHelpShare
               * @member {Object} paymentFlow
               */
              paymentReceipt: '=',
              flowIsAutopay: '='
            },
            controller: [
              '$scope',
              '$rootScope',
              '$location',
              '$filter',
              'shareService',
              'PaymentFlowFactory',
              function ($scope, $rootScope, $location, $filter, shareService, PaymentFlowFactory) {
                $scope.loc = $rootScope.loc;
                $scope.gotoView = function (url) {
                  PaymentFlowFactory.resetCreditCardDetails();
                  PaymentFlowFactory.reset();
                  $rootScope.gotoView(url);
                };
                $scope.userData = PaymentFlowFactory.getUserSetData();

                $scope.shareReceipt = function () {
                  var shareContent = '';
                  var maskFilter = $filter('maskAccount');
                  var maskAcct = maskFilter($scope.userData.accountNumber);
                  var todaysDate = new Date();

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

                  if ($scope.flowIsAutopay) {

                    shareContent = $rootScope.loc.BP_PAYMENT_DATE + ": " + ((todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear()) + "\n" +
                         $rootScope.loc.BP_CONFIRMATION_CODE + ": " + $scope.userData.successConfirmationCode + "\n" +
                         $rootScope.loc.POLICY_ID + ": " + $scope.paymentReceipt.account.policyMembership.policyId + "\n" +
                         $rootScope.loc.SUBSCRIBER_ID + ": " + $scope.paymentReceipt.account.policyMembership.fullExternalId + "\n" +
                         $rootScope.loc.BP_TITLE_PAYMENT_FREQUENCY + ": " + $scope.loc.BP_AUTOPAY + "\n" +
                         $rootScope.loc.BP_MONTHLY_DRAFT_DATE + ": " + $scope.loc.BP_MONTHLY_DRAFT + "\n" +
                         $rootScope.loc.BP_MONTHLY_PREMIUM_AMOUNT + ": " + $scope.paymentReceipt.account.currentInvoice.billedAmount  + "\n" +
                         $rootScope.loc.BP_HEADER_PAYMENT_METHOD + ": " +  (PaymentFlowFactory.getPaymentMethod() === 'bankdraft' ? $scope.loc.BP_BANK_DRAFT : $scope.loc.BP_CREDIT_CARD) + "\n" +
                         $rootScope.loc.BP_TITLE_BILLING_METHOD + ": " +  $scope.localizedBillingMethod + "\n" ;
                    if (PaymentFlowFactory.getPaymentMethod() === 'bankdraft') {
                      shareContent = shareContent +
                          $rootScope.loc.BP_NAME_ON_ACCOUNT + ": " + $scope.userData.accountHolderName + "\n" +
                          $rootScope.loc.BP_ACCOUNT_TYPE + ": " + ($scope.userData.accountType === 'Savings' ? $scope.loc.SAVINGS : $scope.loc.BP_CHECKING) + "\n" +
                          $rootScope.loc.BP_ROUTING_NUMBER + ": " + $scope.userData.routingNumber + "\n" +
                          $rootScope.loc.BP_BANK_ACCOUNT_NUMBER + ": " + maskAcct;
                    } else {
                      //payment method is credit card
                      shareContent = shareContent +
                          $rootScope.loc.BP_NAME_ON_CARD + ": " + $scope.userData.creditCardDetails.firstName + "\n" +
                          $rootScope.loc.BP_CARD_NUMBER + ": " + maskFilter($scope.userData.creditCardDetails.lastFour) + "\n" +
                          $rootScope.loc.BP_EXPIRATION_DATE + ": " + $scope.userData.creditCardDetails.month + "/" + $scope.userData.creditCardDetails.year;
                    }
                  } else {

                    shareContent = $rootScope.loc.BP_PAYMENT_DATE + ": " + ((todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear()) + "\n" +
                        $rootScope.loc.BP_CONFIRMATION_CODE + ": " + $scope.userData.successConfirmationCode + "\n" +
                        $rootScope.loc.POLICY_ID + ": " + $scope.paymentReceipt.policyMembership.policyId + "\n" +
                        $rootScope.loc.SUBSCRIBER_ID + ": " + $scope.paymentReceipt.policyMembership.fullExternalId + "\n" +
                        $rootScope.loc.BP_TITLE_PAYMENT_FREQUENCY + ": " + (PaymentFlowFactory.getPaymentFrequency() === 'autopay' ? $scope.loc.BP_AUTOPAY : $scope.loc.BP_ONE_TIME_PAYMENT) + "\n" +
                        $rootScope.loc.BP_MONTHLY_PREMIUM_AMOUNT + ": " + $scope.paymentReceipt.currentInvoice.billedAmount + "\n" +
                        $rootScope.loc.BP_TOTAL_ACCOUNT_BALANCE + ": " + $scope.paymentReceipt.currentInvoice.totalDueAmount + "\n" +
                        $rootScope.loc.BP_AMOUNT_PAID_TODAY + ": " + $scope.userData.paymentAmount + "\n" +
                        $rootScope.loc.BP_HEADER_PAYMENT_METHOD + ": " + (PaymentFlowFactory.getPaymentMethod() === 'bankdraft' ? $scope.loc.BP_BANK_DRAFT : $scope.loc.BP_CREDIT_CARD) + "\n";

                    if ($scope.paymentReceipt.isPaymentProcessing) {
                      shareContent = shareContent +
                          $rootScope.loc.BP_PREVIOUS_PAYMENT + " (" + $rootScope.loc.BP_CURRENTLY_PROCESSING + ")" + ": " + $scope.paymentReceipt.currentInvoice.balanceForwardAmount + "\n";
                    }

                    if ($scope.paymentReceipt.preferences.isPaperless === false) {
                      shareContent = shareContent +
                          $rootScope.loc.BP_TITLE_BILLING_METHOD + ": " + (PaymentFlowFactory.getBillingMethod() === 'email' ? $scope.loc.EMAIL : $scope.loc.BP_POSTAL_MAIL) + "\n";
                    }

                    if (PaymentFlowFactory.getPaymentMethod() === 'bankdraft') {
                      shareContent = shareContent +
                          $rootScope.loc.BP_NAME_ON_ACCOUNT + ": " + $scope.userData.accountHolderName + "\n" +
                          $rootScope.loc.BP_ACCOUNT_TYPE + ": " + ($scope.userData.accountType === 'Savings' ? $scope.loc.SAVINGS : $scope.loc.BP_CHECKING) + "\n" +
                          $rootScope.loc.BP_ROUTING_NUMBER + ": " + $scope.userData.routingNumber + "\n" +
                          $rootScope.loc.BP_BANK_ACCOUNT_NUMBER + ": " + maskAcct;
                    } else {
                      //payment method is credit card
                      shareContent = shareContent +
                          $rootScope.loc.BP_NAME_ON_CARD + ": " + $scope.userData.creditCardDetails.firstName + "\n" +
                          $rootScope.loc.BP_CARD_NUMBER + ": " + maskFilter($scope.userData.creditCardDetails.lastFour) + "\n" +
                          $rootScope.loc.BP_EXPIRATION_DATE + ": " + $scope.userData.creditCardDetails.month + "/" + $scope.userData.creditCardDetails.year;
                    }
                  }//end if flowIsAutoPay

                  shareService.showSharing(shareService.contentType.TEXT, shareContent);
                };
              }
            ]
          };
        }
      ]);
}());
