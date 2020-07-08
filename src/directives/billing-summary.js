/**
 * Directive for the billing card on the home screen.
 *
 * @namespace Directives
 * @class billingSummary
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.billingSummary', [])
  .directive('billingSummary', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/billing-summary.html',
        scope: {
          /**
          * Display information for the payment.
          *
          * @memberof billingSummary
          * @member {Object} billingDetails
          */
          billingDetails: '=',
          policy:'='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.enterPaymentFlow = $rootScope.enterPaymentFlow;
            $rootScope.billingTrackStates('summary', $scope.billingDetails);

            $scope.currentAmtDue = $scope.billingDetails.currentAmtDue ? $scope.billingDetails.currentAmtDue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'}) : '';
            $scope.billedAmount = $scope.billingDetails.billedAmount ? $scope.billingDetails.billedAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'}) : '';
            $scope.balanceForwardAmount = $scope.billingDetails.balanceForwardAmount ? $scope.billingDetails.balanceForwardAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'}) : '';
            $scope.currentInvoiceBalanceForwardAmount = $scope.billingDetails.currentInvoice.balanceForwardAmount ? $scope.billingDetails.currentInvoice.balanceForwardAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'}) : '';

            /**
             * Retrieves the payment amount dollars for display.
             *
             * @memberof homeCardBilling
             * @method getAmountDollars
             * @return {String} The dollar amount
             */
            $scope.getAmountDollars = function() {
              return $scope.currentAmtDue.slice(1, $scope.currentAmtDue.indexOf('.') + 1) || 0;
            };

            /**
             * Retrieves the payment amount cents for display.
             *
             * @memberof homeCardBilling
             * @method getAmountCents
             * @return {String} The cents amount
             */
            $scope.getAmountCents = function() {
              return $scope.currentAmtDue.slice($scope.currentAmtDue.indexOf('.') + 1);
            };
          }
        ]
      };
    }
  ]);
}());
