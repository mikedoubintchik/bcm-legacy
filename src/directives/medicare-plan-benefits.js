/**
 * Directive for the faq page.
 *
 * @namespace Directives
 * @class faq
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.medicarePlanBenefits', [])
  .directive('medicarePlanBenefits', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/medicare-plan-benefits.html',
        scope: {
          /**
          * Display information for the medicare page.
          *
          * @memberof medicarePlanBenefits
          * @member {Object} medicarePlanBenefitsDetails
          */
          medicarePlanBenefitsDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          function($rootScope, $scope, adobeService) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.gotoView = $rootScope.gotoView;

            $scope.toggleItem = function() {
              if ($scope.expandedDiv){
                $scope.expandedDiv = true;
              }

              $scope.expandedDiv = !$scope.expandedDiv;
            };
          }
        ]
      };
    }
  ]);
}());
