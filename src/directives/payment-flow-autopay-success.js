/**
 * Directive for the payment flow autopay success confirmation.
 *
 * @namespace Directives
 * @class paymentFlowAutoPaySuccess
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.paymentFlowAutoPaySuccess', [])
      .directive('paymentFlowAutoPaySuccess', [
        function () {
          return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/payment-flow-autopay-success.html',
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
