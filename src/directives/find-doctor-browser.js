/**
 * Directive for the findDoctorBrowser.
 *
 * @namespace Directives
 * @class findDoctorBrowser
 */
(function () {
    'use strict';

    angular.module('blueconnect.mobile.directives.findDoctorBrowser', [])
        .directive('findDoctorBrowser', [
          function () {
            return {
              restrict: 'E',
              replace: true,
              templateUrl: 'partials/find-doctor-browser.html',
              scope: {
                findDoctorBrowserDetails: '=',
                smartShopperFlow: '='
              },
              controller: [
                '$scope',
                '$rootScope',
                '$location',
                'TransparencyFactory',
                function ($scope, $rootScope, $location, TransparencyFactory) {
                  $scope.loc = $rootScope.loc;
                  $scope.gotoView = $rootScope.gotoView;
                  $rootScope.openMapView = false; //this is for result page
                  $scope.distance = TransparencyFactory.getDistance();
                  $scope.selectedPlan = TransparencyFactory.getSelectedPlan(); // plan details the user has selected
                  $scope.selectedBrowse = TransparencyFactory.getSearchTerm(); // browse icon the user has selected in find-doctor-search page

                  $scope.planName = ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $scope.selectedPlan.lobDesc : $scope.selectedPlan.name;
                  /**
                   * Based on the user selection in browse level one page go to browse level 2 page
                   *
                   * @memberof findDoctorBrowser
                   * @method gotoBrowseNextLevelPage
                   */

                  $scope.gotoBrowseNextLevelPage = function(selectedTerm) {
                    $scope.pcpFlow = (selectedTerm.id == '260005172' || selectedTerm.id == '260005173') ? 'true' : '';
                    selectedTerm = selectedTerm || {};
                    $rootScope.healthNavTrackActions(4, {searchTerm: selectedTerm.name});
                    if (selectedTerm.id) { // if the selection in the browse level one have id go to reults page
                      TransparencyFactory.setSearchSpecialtyId(selectedTerm.id);
                      TransparencyFactory.setResultsTerm(selectedTerm.name);
                      $rootScope.gotoView('/find-doctor-search-results?searchTerm=' + (selectedTerm.name || $scope.selectedBrowse) + '&planName=' + $scope.planName + '&network_id=' + $scope.selectedPlan.id + '&id=' + TransparencyFactory.getSearchSpecialtyId() + '&isPcpFlow=' + $scope.pcpFlow + '&smartShopperFlow=' + $scope.smartShopperFlow);
                    } else {
                      if (selectedTerm.browseLevel == '2') {
                         TransparencyFactory.setBrowseLevelTwoTerm(selectedTerm.name);
                       } else {
                         TransparencyFactory.setBrowseTerm(selectedTerm.name);
                       }
                      $rootScope.gotoView('/find-doctor-browser?searchTerm='+ $scope.selectedBrowse + '&planName='+ $scope.planName + '&planId=' + $scope.selectedPlan.id+'&browseTerm=true&browseLevel=' + selectedTerm.browseLevel + '&smartShopperFlow=' + $scope.smartShopperFlow);
                    }
                  };
                }
              ]
            };
          }
        ]);
  }());
