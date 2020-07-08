/**
 * Directive for the monetary amounts box box on the claim details page.
 *
 * @namespace Directives
 * @class claimAmounts
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimAmounts', [])
  .directive('claimAmounts', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claim-amounts.html',
        scope: {
          /**
          * The monetary amounts.
          *
          * @memberof claimAmounts
          * @member {Object} amounts
          */
          amounts: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'adobeService',
          function($scope, $rootScope, adobeService) {
            $scope.loc      = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            var savingsPercent = $scope.amounts.savings > 0 ? $scope.amounts.savings / $scope.amounts.originalBilled * 100: 0;
            var upfrontPercent = $scope.amounts.upfrontCost.amount > 0 ? $scope.amounts.upfrontCost.amount / $scope.amounts.originalBilled * 100 + savingsPercent : savingsPercent;
            var remainingPercent = $scope.amounts.remainingCost > 0 ? $scope.amounts.remainingCost / $scope.amounts.originalBilled * 100 + upfrontPercent : upfrontPercent;

            $scope.percentages = {
              savings: savingsPercent,
              upfront: upfrontPercent,
              remaining: remainingPercent
            };

            var generateGraph = function() {
              var graphHeight = 10;

              //Sum up the three points
              var sum = $scope.amounts.savings + $scope.amounts.bcbsncPayment + $scope.amounts.remainingCost;

              //Calcuate each point's percentages
              var savingsPercentage       = ( ($scope.amounts.savings/sum) * 100 ).toFixed(2);
              var paymentAmountPercentage = ( ($scope.amounts.bcbsncPayment/sum) * 100).toFixed(2);
              var remainingCostPercentage = ( ($scope.amounts.remainingCost/sum) * 100 ).toFixed(2);

              //Finally calculate each point's percentage against graphHeight;
              var savingsPoint        = ( (savingsPercentage/100) * graphHeight ).toFixed(2);
              var paymentAmountPoint  = ( (paymentAmountPercentage/100) * graphHeight ).toFixed(2);
              var remainingCostPoint  = ( (remainingCostPercentage/100) * graphHeight ).toFixed(2);

              $scope.claimgraph = {
                outline: true,
                graphHeight: 10,
                bars:[
                  {color: '#79AD65', bottom: parseFloat(remainingCostPercentage) + parseFloat(paymentAmountPercentage), height: savingsPercentage, description: $rootScope.loc.MEMBER_SAVINGS},
                  {color: '#EBF3D8', bottom: remainingCostPercentage, height: paymentAmountPercentage, description: $rootScope.loc.PAID_BY_BCBSNC},
                  {color: '#0073AE', bottom: 0, height: remainingCostPercentage, description: $rootScope.loc.YOU_MAY_OWE}
                ],
                legendLines: [
                  {name: $rootScope.loc.ORIGINAL_BILL, value: '$' + $scope.amounts.originalBilled.toFixed(2), bottom: 50, height: .5, width: 1}
                ],
                leftSide: [
                  {name: $rootScope.loc.MEMBER_SAVINGS, value: '$' + $scope.amounts.savings.toFixed(2), bottom: 0, height: 50, color: '#79AD65'},
                  {name: $rootScope.loc.PAID_BY_BCBSNC, value: '$' + $scope.amounts.bcbsncPayment.toFixed(2), bottom: 0, height: 50, color: '#79AD65'},
                  {name: $rootScope.loc.YOU_MAY_OWE, value: '$' + $scope.amounts.remainingCost.toFixed(2), bottom: 0, height: 50, color: '#0073AE'}
                ]
              };
            };
            generateGraph();
          }
        ]
      };
    }
  ]);
}());
