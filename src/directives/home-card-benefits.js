/**
* Directive for the benefits card on the home screen.
*
* @namespace Directives
* @class homeCardBenefits
*/
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardBenefits', [])
  .directive('homeCardBenefits', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-benefits.html',
        scope: {
          benefits: '=',
          policySelection: '=',
          selectedPolicy: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$filter',
          'adobeService',
          'helpService',
          function($scope, $rootScope, $filter, adobeService, helpService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.policyIndex = $scope.policyIndex || 0;
            $scope.policy = $rootScope.policies[$rootScope.selectedPolicy.index];
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

            /**
             * Sets the benfits available if user has benefits
             *
             * @memberof homeCardBenefits
             * @method checkLink
             */
            $scope.checkLink = function() {
             if ($scope.policySelection.choice == 'DENTAL_ONLY') {
               return (!$scope.policySelection.lowCostDentalOnlyPlan) ? $scope.gotoView('/benefits/dental-only') : $scope.gotoView('/benefits/low-cost-dental-only');
             } else if ($scope.policySelection.choice == 'CONTRACEPTIVE_ONLY') {
              return $scope.gotoView('/benefits/contraceptive-only');
            } else if ($scope.policy.sourceSystem.toLowerCase() == 'amisys') {
              return $scope.gotoView('/medicare-benefits');
            }else if ($scope.policySelection.choice == 'BBTRX_ONLY') {
              return $scope.gotoView('/benefits/bbt-only');
            }else if ($scope.policySelection.choice == 'VISION_ONLY') {
              return $scope.gotoView('/benefits/vision-only');
            } 

             return $scope.gotoView('/benefits');
            };

            $scope.openModal = function() {
              if ($scope.policySelection.choice == 'CONTRACEPTIVE_ONLY') {
                $rootScope.headerTerm = $scope.benefits.modalHeader;
                $scope.helpInfo = {
                  benefitsModalText: $scope.benefits.modalText,
                  contraceptiveInfo : true
                };
                helpService.help($scope.helpInfo);
              }
            };

            /**
             * Pass through method to external links for dental benefits
             *
             * @memberof homeCardBenefits
             * @method gotoDentalBenefits
             */
            $scope.gotoDentalBenefits = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            /**
             * Pass through method to external links for vision benefits
             *
             * @memberof homeCardBenefits
             * @method gotoVisionBenefits
             */
            $scope.gotoVisionBenefits = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            /**
             * Pass through method to external links for drug benefits
             *
             * @memberof homeCardBenefits
             * @method gotoDrugBenefits
             */
            $scope.gotoDrugBenefits = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

          }
        ]
      };
    }
  ]);
}());
