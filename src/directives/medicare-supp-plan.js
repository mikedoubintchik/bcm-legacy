/**
 * Directive for the mediacre supp-plan page.
 *
 * @namespace Directives
 * @class medicare-supp-plan
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.medicareSuppPlan', [])
  .directive('medicareSuppPlan', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/medicare-supp-plan.html',
        scope: {
          /**
          * Display information for the medicare page.
          *
          * @memberof medicarePlanBenefits
          * @member {Object} medicarePlanBenefitsDetails
          */
          medicareSuppPlanDetails: '=',
          policy: '=',
          policyIndex: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          function($rootScope, $scope, adobeService) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
            $scope.gotoView = $rootScope.gotoView;
            $scope.loc = $rootScope.loc;

          }
        ]
      };
    }
  ]);
}());
