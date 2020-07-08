/**
 * Directive for the payment flow autopay setup confirmation.
 *
 * @namespace Directives
 * @class paymentFlowAutoPaySetup
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.paymentFlowAutoPaySetup', [])
      .directive('paymentFlowAutoPaySetup', [
        function () {
          return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/payment-flow-autopay-setup.html',
            scope: {
              billingInfo: '=',
              userSelectedAutoPay: '=?',
              flowIsAutopay: '=?'
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

                if ($scope.flowIsAutopay){
                  $scope.showAutoPay = true;
                }else {
                  //if the user is in autopay they come to the screen with only the autopay option showing and autopay automatically selected
                  $scope.showAutoPay = (
                      (
                          // Displays when account balance > 0 and user is not outside of reinstatement period.
                          $scope.billingInfo.isPaymentProcessing ?
                              $scope.billingInfo.currentInvoice.remainingBalance > 0:
                              $scope.billingInfo.currentInvoice.totalDueAmount > 0
                      )
                      // doesn't show when user is in reinstatement, at all
                      // doesn't show when user is a medicare member
                      && !$scope.billingInfo.memberInReinstatement && $scope.billingInfo.policyMembership.enrollmentSourceSystemCode.toLowerCase() !== 'amisys'
                  );

                }
              }
            ]
          };
        }
      ]);
}());
