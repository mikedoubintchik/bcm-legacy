/**
 * Directive for the static gray policy header.
 *
 * @namespace Directives
 * @class policyHeaderGray
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.policyHeaderGray', [])
  .directive('policyHeaderGray', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/policy-header-gray.html',
        scope: false,
        controller: [
          '$scope',
          '$rootScope',
          '$filter',
          function($scope, $rootScope, $filter) {
            /**
             * Retrieves the policy dates display string.
             *
             * @memberof policyHeaderGray
             * @param  {Object} policy The policy to get dates for.
             * @method getPolicyDates
             */
             $scope.getPolicyDates = function(policy) {
               policy = policy || {};
               var startDate = $rootScope.loc[$filter('date')(policy.effectiveDate, 'MMM').toUpperCase()] + $filter('date')(policy.effectiveDate, ' yyyy');
               var endDate = $rootScope.loc[$filter('date')(policy.expirationDate, 'MMM').toUpperCase()] + $filter('date')(policy.expirationDate, ' yyyy');

               if(new Date(policy.expirationDate) >= new Date() && policy.active) {
                 endDate = $rootScope.loc.ACTIVE;
               }

               if (policy.active) {
                 return startDate + ' - ' + endDate;
               } else if (!policy.active && new Date(policy.effectiveDate) >= new Date()) {
                 return $rootScope.loc.BP_FUTURE_POLICY;
               } else if (!policy.active) {
                 return $rootScope.loc.INACTIVE_POLICY;
               }
             };

             /**
              * Selects a policy type title
              *
              * @memberof policySelect
              * @method getPolicyPlanTitle
              */
             $scope.getPolicyPlanTitle = function(policy) {
               var response;
               policy = policy || {};
               if (policy.isMedical || policy.isPharmacy){
                 response = $rootScope.loc.HEALTH_PLAN;
               } else if (policy.isDental){
                 response = $rootScope.loc.DENTAL_PLAN;
               } else if (policy.isVision) {
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
