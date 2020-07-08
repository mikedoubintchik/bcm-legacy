/**
 * Directive for the payment flow paperless success confirmation.
 *
 * @namespace Directives
 * @class paymentFlowPaperlessSuccess
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.paymentFlowPaperlessSuccess', [])
      .directive('paymentFlowPaperlessSuccess', [
        function () {
          return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/payment-flow-paperless-success.html',
            scope: {
              /**
               *
               * @memberof paymentFlowPaperlessSuccess
               * @member {Object} paymentFlow
               */
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
