/**
 * Directive for the mediacre footnotes page.
 *
 * @namespace Directives
 * @class medicare-footnotes
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.medicareMoreInformationPdf', [])
  .directive('medicareMoreInformationPdf', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/medicare-more-information-pdf.html',
        scope: {
          /**
          * Display information for the medicare page.
          *
          * @memberof medicarePlanBenefits
          * @member {Object} medicarePlanBenefitsDetails
          */
          medicareMoreInformationPdfDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.gotoView = $rootScope.gotoView;
            $scope.loc = $rootScope.loc;

          }
        ]
      };
    }
  ]);
}());
