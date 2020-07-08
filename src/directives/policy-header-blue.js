/**
 * Directive for the static blue policy header.
 *
 * @namespace Directives
 * @class policyHeaderBlue
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.policyHeaderBlue', [])
  .directive('policyHeaderBlue', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/policy-header-blue.html',
        scope: false,
        controller: [
          '$scope',
          '$rootScope',
          '$filter',
          function($scope, $rootScope, $filter) {
            /**
             * Retrieves the policy dates display string.
             *
             * @memberof policyHeaderBlue
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
              * @memberof policyHeaderBlue
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
