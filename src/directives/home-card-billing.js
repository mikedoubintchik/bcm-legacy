/**
 * Directive for the billing card on the home screen.
 *
 * @namespace Directives
 * @class homeCardBilling
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardBilling', [])
  .directive('homeCardBilling', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-billing.html',
        scope: {
          /**
          * Display information for the payment.
          *
          * @memberof homeCardBilling
          * @member {Object} paymentDetails
          */
          paymentDetails: '=',
          /**
          * Display information for the plan.
          *
          * @memberof homeCardBilling
          * @member {Object} planDetails
          */
          planDetails: '=',
          /**
          * The link to take autopay members to.
          * We will have all autopay functionality in another release
          *
          * @memberof homeCardBilling
          * @member {string} billingLink
          */
          billingLink: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          'BillingInvoiceHistoryFactory',
          function($scope, $rootScope, BillingInvoiceHistoryFactory) {
            $scope.loc = $rootScope.loc;
            $scope.enterPaymentFlow = $rootScope.enterPaymentFlow;
            $scope.billingLink = $scope.billingLink.replace(/'/g, '');
            $scope.gotoView = function(url) {
              if (url.indexOf('http') === 0) {
                return $rootScope.openInSecureBrowser(url);
              }
              $rootScope.gotoView(url);
            };

            BillingInvoiceHistoryFactory.setMedicareSSAValue(!!$scope.planDetails.medicareSSA);

            $scope.amountDue = $scope.paymentDetails.amountDue ? $scope.paymentDetails.amountDue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '';
            $scope.balanceForwardAmount = $scope.paymentDetails.balanceForwardAmount ? $scope.paymentDetails.balanceForwardAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD'}) : '';

            /**
             * Retrieves the payment amount dollars for display.
             *
             * @memberof homeCardBilling
             * @method getAmountDueDollars
             * @return {String} The dollar amount
             */
            $scope.getAmountDueDollars = function() {
              return $scope.amountDue.slice(0, $scope.amountDue.indexOf('.') + 1) || 0;
            };

            /**
             * Retrieves the payment amount cents for display.
             *
             * @memberof homeCardBilling
             * @method getAmountDueCents
             * @return {String} The cents amount
             */
            $scope.getAmountDueCents = function() {
              return $scope.amountDue.slice($scope.amountDue.indexOf('.') + 1);
            };

            $scope.getMonth = function(dateStr) {
              if (!dateStr) {
                return null;
              }
            return dateStr.substr(0, dateStr.indexOf(' ')).toUpperCase();
            }
          }
        ]
      };
    }
  ]);

  // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
  if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
  }
}());
