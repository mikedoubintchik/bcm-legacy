/**
 * Directive for the payment flow reinstatement pending confirmation.
 *
 * @namespace Directives
 * @class paymentFlowReinstatementPending
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.paymentFlowReinstatementPending', [])
      .directive('paymentFlowReinstatementPending', [
        function () {
          return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/payment-flow-reinstatement-pending.html',
            scope: {
              billingInfo: '='
            },
            controller: [
              '$scope',
              '$rootScope',
              '$location',
              'PaymentFlowFactory',
              function ($scope, $rootScope, $location, PaymentFlowFactory) {
                $scope.loc = $rootScope.loc;
                $scope.gotoView = $rootScope.gotoView;
                $scope.userData = PaymentFlowFactory.getUserSetData();
              }
            ]
          };
        }
      ]);
}());
