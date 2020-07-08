/**
 * Directive for the faq page.
 *
 * @namespace Directives
 * @class faq
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.medicareDrugBenefits', [])
  .directive('medicareDrugBenefits', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/medicare-drug-benefits.html',
        scope: {
          /**
          * Display information for the medicare page.
          *
          * @memberof medicareDrugBenefits
          * @member {Object} medicareDrugBenefitsDetails
          */
          medicareDrugBenefitsDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          function($rootScope, $scope, adobeService) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.gotoView = $rootScope.gotoView;

            $scope.toggleItem = function() {
              if($scope.expandedDiv){
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
