/**
 * Directive for the benefits select plans info page.
 *
 * @namespace Directives
 * @class benefitsInfo
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.benefitsSelectDetail', [])
  .directive('benefitsSelectDetail', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/benefits-select-detail.html',
        scope: {
          /**
          * Display information for the benefits page.
          *
          * @memberof benefitsInfo
          * @member {Object} benefitsSelectDetail
          */
          benefitsData: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          '$location', 
          '$anchorScroll',          
          function($rootScope, $scope, adobeService, $location, $anchorScroll) {
            $scope.loc = $rootScope.loc;
            $scope.showBenefitsTable = false;
            $scope.showFullFootnotes = false;
            $scope.trackAction = $rootScope.trackAction;

            $scope.FootnotesDetailButton = $rootScope.loc.FOOTNOTE_SHOW_FULL_DETAILS;
            $scope.footnotes = $scope.benefitsData.footnotes.substring(0,155)+'...';
            $scope.helpButtonText = $rootScope.loc.HELP;
            $scope.collapseExpandIcon = 'plus-expand';

            $scope.toggleBenefitsTable = function(event, memberIndex) {
              //a Button click by default makes an attempt to submit, which reloads the page and we go from  out-of-network page to in-network, because in-network is the default page on load
              //the preventDefault and stopPropagation will stop an attempt to submit the form, so page won't reload
              event.preventDefault();
              event.stopPropagation();
              for (var i = 0; i < $scope.benefitsData.itemDTO.length; i++) {
                if (
                  $scope.benefitsData.itemDTO[i].memberIndex === memberIndex
                ) {
                  if ($scope.benefitsData.itemDTO[i].cardExpanded) {
                    var id = "bencardtop" + memberIndex;
                    $location.hash(id);
                    $anchorScroll(id);
                  }
                  $scope.benefitsData.itemDTO[i].cardExpanded = !$scope
                    .benefitsData.itemDTO[i].cardExpanded;
                }
              }
            };

            $scope.toggleFootnotes = function(){
              $scope.showFullFootnotes = !$scope.showFullFootnotes;

              if($scope.showFullFootnotes) {
                $scope.collapseExpandIcon = 'minus-collapse';
                $scope.footnotes = $scope.benefitsData.footnotes;
                $scope.FootnotesDetailButton = $rootScope.loc.FOOTNOTE_HIDE_FULL_DETAILS;
              } else {
                $scope.collapseExpandIcon = 'plus-expand';
                $scope.footnotes = $scope.benefitsData.footnotes.substring(0,155)+'...';
                $scope.FootnotesDetailButton = $rootScope.loc.FOOTNOTE_SHOW_FULL_DETAILS;
              }
            };

            /**
             * Takes a member to the help view.
             *
             * @memberof benefitsInfo
             * @method gotoView
             */
            $scope.gotoView = function(view, title) {

              $rootScope.gotoView(view);
            };
          }
        ]
      };
    }
  ]);
}());
