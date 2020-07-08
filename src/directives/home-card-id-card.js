/**
 * Directive for the card on the home screen for ID card.
 *
 * @namespace Directives
 * @class homeCardIdCard
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardIdCard', [])
  .directive('homeCardIdCard', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-id-card.html',
        scope: {
          /**
          * The policy index of the ID card.
          *
          * @memberof homeCardIdCard
          * @member {Number} policyIndex
          */
          policyIndex: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          '$filter',
          function($scope, $rootScope, $filter) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.policyIndex = $scope.policyIndex || 0;
            $scope.policy = $rootScope.policies[$scope.policyIndex];
            $scope.trackAction = $rootScope.trackAction;

            /**
             * Retrieves the policy dates display string.
             *
             * @memberof homeCardBenefits
             * @param  {Object} policy The policy to get dates for.
             * @method getPolicyDates
             */
            $scope.getPolicyDates = function(policy) {
              var startDate = $rootScope.loc[$filter('date')(policy.effectiveDate, 'MMM').toUpperCase()] + $filter('date')(policy.effectiveDate, ' yyyy');
              var endDate = $rootScope.loc[$filter('date')(policy.expirationDate, 'MMM').toUpperCase()] + $filter('date')(policy.expirationDate, ' yyyy');
              var policyYear = $filter('date')(policy.effectiveDate, 'yyyy');
              var expirationMonth = $rootScope.loc[$filter('date')(new Date("December 31, 0000 00:00:00"), 'MMM').toUpperCase()];

              if(new Date(policy.expirationDate) >= new Date() && policy.active) {
                endDate = $rootScope.loc.ACTIVE;
              } else if (new Date(policy.expirationDate) >= new Date() && !policy.active) {
                endDate = expirationMonth + ' ' + policyYear;
              }

              return startDate + ' - ' + endDate;
            };

            /**
             * Selects a policy type title
             *
             * @memberof homeCardBenefits
             * @method getPolicyPlanTitle
             */
            $scope.getPolicyPlanTitle = function(policy) {
              var response;
              if (new Date(policy.expirationDate) < new Date() && (policy.isMedical || policy.isPharmacy)) {
                 response = $rootScope.loc.HEALTH_PLAN_INACTIVE;
              } else if (new Date(policy.expirationDate) < new Date() && policy.isDental){
                response = $rootScope.loc.DENTAL_PLAN_INACTIVE;
              } else if (new Date(policy.expirationDate) < new Date() && policy.isVision){
                response = $rootScope.loc.BLUE2020_HEADER_VISION_PLAN_INACTIVE;
              } else if (policy.isMedical || policy.isPharmacy){
                response = $rootScope.loc.HEALTH_PLAN;
              } else if (policy.isDental){
                response = $rootScope.loc.DENTAL_PLAN;
              } else if (policy.isVision){
                response = $rootScope.loc.BLUE2020_HEADER_VISION_PLAN;
              } else {
                response = $rootScope.loc.HEALTH_PLAN;
              }
              return response;
            };
          }
        ]
      };
    }
  ]);
}());
