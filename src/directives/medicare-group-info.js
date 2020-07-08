/**
 * Directive for the mediacre footnotes page.
 *
 * @namespace Directives
 * @class medicare-footnotes
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.medicareGroupInfo', [])
  .directive('medicareGroupInfo', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/medicare-group-info.html',
        scope: {
          /**
          * Display information for the medicare page.
          *
          * @memberof medicarePlanBenefits
          * @member {Object} medicarePlanBenefitsDetails
          */
          medicareGroupInfoDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.gotoView = $rootScope.gotoView;
          }
        ]
      };
    }
  ]);
}());
