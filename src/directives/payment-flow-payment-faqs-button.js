/**
 * Directive for the payment flow have questions & faqs .
 *
 * @namespace Directives
 * @class paymentFlowFaqsButton
 */
(function () {
    'use strict';
  
    angular.module('blueconnect.mobile.directives.paymentFlowFaqsButton', [])
        .directive('paymentFlowFaqsButton', [
          function () {
            return {
              restrict: 'E',
              replace: true,
              templateUrl: 'partials/payment-flow-faqs-button.html',
              scope: {
                /**
                 *
                 * @memberof paymentFlowFaqsButton
                 * @member {Object} paymentFlow
                 */
              },
              controller: [
                '$scope',
                '$rootScope',
                function ($scope, $rootScope) {
                  $scope.loc = $rootScope.loc;
                  $scope.gotoView = $rootScope.gotoView;
                }
              ]
            };
          }
        ]);
  }());
  