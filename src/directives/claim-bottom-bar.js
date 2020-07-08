/**
 * Directive for the claim details bottom bar.
 *
 * @namespace Directives
 * @class claimBottomBar
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimBottomBar', [])
  .directive('claimBottomBar', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claim-bottom-bar.html',
        scope: {
          /**
          * The claim details.
          *
          * @memberof claimBottomBar
          * @member {Object} claim
          */
          claim: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$filter',
          'shareService',
          'adobeService',
          function($scope, $rootScope, $location, $filter, shareService, adobeService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            /**
             * Opens the sharing modal for the claim.
             *
             * @memberof inboxMessageBottomBar
             * @method shareClaim
             */
            $scope.shareClaim = function() {
              var shareContent;
              if($scope.claim.claimStatus == 'Processed'){
                shareContent = $rootScope.loc.CLAIM_NUMBER + ": " + $scope.claim.claimId + "\n" +
                               $rootScope.loc.MEMBER + ": " + $scope.claim.memberName + "\n" +
                               $rootScope.loc.ORIGINAL_BILL + ": $" + ($scope.claim.totalToPayAmount + $scope.claim.savings).toFixed(2) + "\n" +
                               //($scope.claim.savings > 0 ? $rootScope.loc.BCBSNC_SAVINGS + ": -$" + $scope.claim.savings.toFixed(2) + "\n" : "") +
                               //($scope.claim.upfrontCost.amount > 0 ? $rootScope.loc[$scope.claim.upfrontCost.type] + ": $" + $scope.claim.upfrontCost.amount.toFixed(2) + "\n" : "") +
                               (($scope.claim.processed && $scope.claim.totalToPayAmount > 0) ? $rootScope.loc.YOU_MAY_OWE + ": $" + $scope.claim.totalRemainingMemberExpenseAmount.toFixed(2) + "\n" : "") +
                               $rootScope.loc.MEMBER_SAVINGS + ": -$" + $scope.claim.savings.toFixed(2) + "\n" +
                               $rootScope.loc.PAID_BY_BCBSNC + ": $" + $scope.claim.bcbsncPayment.toFixed(2) + "\n" +
                               ($scope.claim.serviceType ? $rootScope.loc.SERVICE + ": " + $rootScope.loc.MEDICAL_SERVICE + "\n" : "") +
                               $rootScope.loc.PROVIDED_BY + ": " + $scope.claim.providerRecordName + "\n" +
                               $rootScope.loc.CURRENT_STATUS + ": " + $rootScope.loc.PROCESSED + "\n" +
                               $rootScope.loc.DATE_OF_SERVICE + ": " + $filter('date')($scope.claim.startServiceDate, 'M/d/yyyy');
              } else {
                shareContent = $rootScope.loc.CLAIM_NUMBER + ": " + $scope.claim.claimId + "\n" +
                               $rootScope.loc.MEMBER + ": " + $scope.claim.memberName + "\n" +
                               ($scope.claim.serviceType ? $rootScope.loc.SERVICE + ": " + $rootScope.loc.MEDICAL_SERVICE + "\n" : "") +
                               $rootScope.loc.PROVIDED_BY + ": " + $scope.claim.providerRecordName + "\n" +
                               $rootScope.loc.CURRENT_STATUS + ": " + $rootScope.loc.PENDING + "\n" +
                               $rootScope.loc.DATE_OF_SERVICE + ": " + $filter('date')($scope.claim.startServiceDate, 'M/d/yyyy');
                }

                shareService.showSharing(shareService.contentType.TEXT, shareContent);
            };
          }
        ]
      };
    }
  ]);
}());
