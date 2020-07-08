/**
 * Directive for the policy select element.
 *
 * @namespace Directives
 * @class policySelect
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.policySelect', []).directive('policySelect', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/policy-select.html',
        scope: false,
        controller: [
          '$scope',
          '$rootScope',
          '$filter',
          'adobeService',
          '$location',
          function($scope, $rootScope, $filter, adobeService, $location) {
            /**
             * Retrieves the policy dates display string.
             *
             * @memberof policySelect
             * @param  {Object} policy The policy to get dates for.
             * @method getPolicyDates
             */
            $scope.getPolicyDates = function(policy) {
              var startDate =
                $rootScope.loc[$filter('date')(policy.effectiveDate, 'MMM').toUpperCase()] +
                $filter('date')(policy.effectiveDate, ' yyyy');
              var endDate =
                $rootScope.loc[$filter('date')(policy.expirationDate, 'MMM').toUpperCase()] +
                $filter('date')(policy.expirationDate, ' yyyy');
              var policyYear = $filter('date')(policy.effectiveDate, 'yyyy');
              var expirationMonth =
                $rootScope.loc[
                  $filter('date')(new Date('December 31, 0000 00:00:00'), 'MMM').toUpperCase()
                ];

              if (new Date(policy.expirationDate) >= new Date() && policy.active) {
                endDate = $rootScope.loc.ACTIVE;
              } else if (new Date(policy.expirationDate) >= new Date() && !policy.active) {
                endDate = expirationMonth + ' ' + policyYear;
              }
              return startDate + ' - ' + endDate;
            };

            /**
             * Retrieves the policy dates display string for header.
             *
             * @memberof policySelect
             * @param  {Object} policy The policy to get dates for.
             * @method getPolicyDatesHeader
             */
            $scope.getPolicyDatesHeader = function(policy) {
              var response;
              if (!policy) {
                return policy;
              }

              var startDate =
                $rootScope.loc[$filter('date')(policy.effectiveDate, 'MMM').toUpperCase()] +
                $filter('date')(policy.effectiveDate, ' yyyy');
              var endDate =
                $rootScope.loc[$filter('date')(policy.expirationDate, 'MMM').toUpperCase()] +
                $filter('date')(policy.expirationDate, ' yyyy');
              var current = new Date();

              if (new Date(policy.expirationDate) >= current && policy.active) {
                endDate = $rootScope.loc.ACTIVE;
              }
              if (policy.active) {
                response = startDate + ' - ' + endDate;
              } else if (!policy.active && new Date(policy.effectiveDate) >= current) {
                response = $rootScope.loc.BP_FUTURE_POLICY;
              } else if (!policy.active) {
                response = $rootScope.loc.INACTIVE_POLICY;
              }

              return response;
            };

            /**
             * Toggles the select element.
             *
             * @memberof policySelect
             * @method toggleSelectOpen
             */
            $scope.toggleSelectOpen = function(isOpen) {
              $scope.trackselectDropDownAction(isOpen ? 'close' : 'open');
              if ($rootScope.policies || $rootScope.policies.length > 1) {
                /**
                 * Whether the select element is open.
                 *
                 * @memberof policySelect
                 * @member {Boolean} selectOpen
                 */
                $scope.selectOpen = !$scope.selectOpen;
                $rootScope.blurContent = $scope.selectOpen;
              }
            };

            /**
             * ($rootScope) Allows outside controllers and directives to close the policy select.
             *
             * @memberof policySelect
             * @method closePolicySelect
             */
            $rootScope.closePolicySelect = function() {
              if ($scope.selectOpen) {
                $scope.selectOpen = false;
                $rootScope.blurContent = false;
              }
            };

            /**
             * Returns whether a policy is active.
             *
             * @memberof policySelect
             * @method isActive
             * @param  {Object} policy The policy to check
             * @return {Boolean} Whether the policy is active
             */
            $scope.isActive = function(policy) {
              return new Date(policy.expirationDate) > new Date();
            };

            /**
             * Returns whether a policy is future policy or not.
             *
             * @memberof policySelect
             * @method isActiveFuture
             * @param  {Object} policy The policy to check
             * @return {Boolean} Whether the policy is Future
             */

            $scope.isActiveFuture = function(policy) {
              if (new Date(policy.effectiveDate) > new Date()){
                $rootScope.futurePolicy = true;
                return true;
              }
              
            };

            /**
             * Selects a policy index.
             *
             * @memberof policySelect
             * @method selectPolicy
             * @param  {Number} index The policy index
             */
            $scope.selectPolicyFromDropdown = function(index) {
              $scope.trackselectDropDownAction('select');
              $scope.toggleSelectOpen(true);
              $rootScope.selectPolicy(index);
              $rootScope.refreshNavbar();
            };

            /**
             * Tracks the action of the plan dropdown.
             *
             * @memberof policySelect
             * @method trackselectDropDownAction
             * @param  {String} actionVariable the action to track ('open','close' or 'select')
             *
             */
            $scope.trackselectDropDownAction = function(actionVariable) {
              var action = 'homePlanDropdown:' + actionVariable;
              var section = $location.path().split('/')[1];

              section = section[0].toUpperCase() + section.slice(1);
              adobeService.trackAction(action, section);
            };

            /**
             * Selects a policy type title
             *
             * @memberof policySelect
             * @method getPolicyPlanTitle
             */
            $scope.getPolicyPlanTitle = function(policy) {
              if (!policy) {
                return policy;
              }
              // FIX: why is response set like this?
              var response;
              if (policy.isMedical || policy.isPharmacy) {
                response = $rootScope.loc.HEALTH_PLAN;
              } else if (policy.isDental) {
                response = $rootScope.loc.DENTAL_PLAN;
              } else if (policy.isVision) {
                response = $rootScope.loc.BLUE2020_HEADER_VISION_PLAN;
              } else {
                response = $rootScope.loc.HEALTH_PLAN;
              }
              return response;
            };
          },
        ],
      };
    },
  ]);
})();
