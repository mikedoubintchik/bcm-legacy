/**
 * Directive for the payment flow autopay pending confirmation.
 *
 * @namespace Directives
 * @class paymentFlowAutoPayPending
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.paymentFlowAutoPayPending', [])
      .directive('paymentFlowAutoPayPending', [
        function () {
          return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/payment-flow-autopay-pending.html',
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
                $scope.userSetData = PaymentFlowFactory.getUserSetData();
              }
            ]
          };
        }
      ]);
}());
