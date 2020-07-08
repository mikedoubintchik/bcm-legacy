/**
 * Directive for the benefits view coverage page.
 *
 * @namespace Directives
 * @class benefitsCoverageDetails
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.benefitsCoverageDetails', [])
  .directive('benefitsCoverageDetails', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/benefits-coverage-details.html',
        scope: {
          /**
          * Display information for the benefits coverage page.
          *
          * @memberof benefitsCoverageDetails
          * @member {Object} coverageData
          */
          coverageData: '=',
          policySelection: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;

            $scope.showFullFootnotes      = false;
            $scope.FootnotesDetailButton  = $rootScope.loc.FOOTNOTE_SHOW_FULL_DETAILS;
            $scope.footnotes              = $scope.coverageData.footnotes.content.substring(0,155)+'...';
            $scope.collapseExpandIcon     = 'plus-expand';

            /**
             * Pass through method to external links for state prescription drugs
             *
             * @memberof benefits-coverage-details
             * @method gotoSHR
             */
            $scope.gotoSHR = function() {
              return $rootScope.openInBrowser("https://shp.nctreasurer.com/ActiveEmployees/Pages/default.aspx");
            };

            /**
             * Pass through method to external links for dental benefits
             *
             * @memberof benefits-coverage-details
             * @method gotoDentalBenefits
             */
            $scope.gotoDentalBenefits = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            /**
             * Pass through method to external links for drug benefits
             *
             * @memberof benefits-coverage-details
             * @method gotoDrugBenefits
             */
            $scope.gotoDrugBenefits = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };

            $scope.toggleFootnotes = function(){
              $scope.showFullFootnotes = !$scope.showFullFootnotes;

              if($scope.showFullFootnotes)
                {
                  $scope.collapseExpandIcon = 'minus-collapse';
                  $scope.footnotes = $scope.coverageData.footnotes.content;
                  $scope.FootnotesDetailButton = $rootScope.loc.FOOTNOTE_HIDE_FULL_DETAILS;
                }
                else
                {
                  $scope.collapseExpandIcon = 'plus-expand';
                  $scope.footnotes = $scope.coverageData.footnotes.content.substring(0,155)+'...';
                  $scope.FootnotesDetailButton = $rootScope.loc.FOOTNOTE_SHOW_FULL_DETAILS;
                }
            };
          }
        ]
      };
    }
  ]);
}());
