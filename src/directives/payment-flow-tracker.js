/**
 * Directive for the payment flow tracker.
 *
 * @namespace Directives
 * @class paymentFlowTracker
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.paymentFlowTracker', [])
    .directive('paymentFlowTracker', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/payment-flow-tracker.html',
          scope: {
            trackerInfo: '=',
            flowIsAutopay: '='
          },
          controller: ['$rootScope', '$scope', function($rootScope, $scope) {
            $scope.loc = $rootScope.loc;

          }]
        };
      }
    ]);
}());
