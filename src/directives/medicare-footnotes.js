/**
 * Directive for the mediacre footnotes page.
 *
 * @namespace Directives
 * @class medicare-footnotes
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.medicareFootnotes', [])
  .directive('medicareFootnotes', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/medicare-footnotes.html',
        scope: {
          /**
          * Display information for the medicare page.
          *
          * @memberof medicarePlanBenefits
          * @member {Object} medicarePlanBenefitsDetails
          */
          medicareFootnotesDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          function($rootScope, $scope, adobeService) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.gotoView = $rootScope.gotoView;
            $scope.loc = $rootScope.loc;

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
