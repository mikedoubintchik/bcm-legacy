/**
 * Directive for the find a doctor navbar.
 *
 * @namespace Directives
 * @class navbar
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.directives.findDoctorNavbar', [])
    .directive('findDoctorNavbar', ['$http', 'config',
      function($http, config) {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/find-doctor-navbar.html',
          scope: {
            /**
            * Information for drawing the navbar.
            *
            * @memberof navbar
            * @member {Object} navbarDetails
            */
            navbarDetails: '=',
            findDoctorSearchDetails: '=',
          },
          controller: [
            '$location',
            '$scope',
            '$http',
            '$rootScope', 'languageService', 'config', 'TransparencyFactory', '$anchorScroll',
            function($location, $scope, $http, $rootScope, languageService, config, TransparencyFactory, $anchorScroll) {
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.language = $rootScope.language || 'en';
              languageService.getLocale($scope.language).then(function(localeReturned) {
                $scope.loc = localeReturned;
              }).catch(console.warn);

              $scope.loggedIn = $rootScope.loggedIn;
              $scope.loc = $rootScope.loc;
              $scope.typeaheadInProgress = false;
              $scope.queryHasFocus = false;
              $scope.selectedPlan = TransparencyFactory.getSelectedPlan();
              $scope.filterText = $scope.navbarDetails.searchTerm;

              $scope.clearQueryAndTypeaheadResults = function() {
                this.filterText = '';
                $scope.typeaheadResults = null;
                $scope.typeaheadError = false;
                $scope.showCommonSearch=true;
                $scope.highlightTextSpecialists=false;
                $scope.queryHasFocus = true;
                angular.element('.input-search').focus();
              };

              if ($scope.navbarDetails){
                $scope.navbarDetails.searchTerm = TransparencyFactory.getSearchTerm();
              }

              $scope.anyCommonTerms = function() {
                return $scope.navbarDetails.commonSearchTerms? $scope.navbarDetails.commonSearchTerms.commonSearchTerms.length > 0: false;
              };

              $scope.goToCommonDetails = function(commonTerm){
                $rootScope.openMapView = false;
                TransparencyFactory.setResultsTerm(commonTerm.commonSearchTerm);
                $rootScope.gotoView(commonTerm.browsePath);
              };

              /**
               * Returns whether or not to hide the right icon on the navigation.
               *
               * @memberof navbar
               * @method rightNavIconHidden
               * @return {Boolean} Whether or not the icon should be hidden.
               */
              $scope.rightNavIconHidden = function rightNavIconHidden() {
                return $rootScope.hideRightNavIcon;
              };

              /**
               * Returns whether the left nav button matches the provided type.
               *
               * @memberof navbar
               * @method leftNavButtonIs
               * @param  {String}  The button type to check for.
               * @return {Boolean} The left nav button matches the type.
               */
              $scope.leftNavButtonIs = function(type) {
                return $rootScope.leftNavButton === type;
              };
              /**
               * Toggles the menu drawer.
               *
               * @memberof navbar
               * @method toggleMenuOpen
               */
              $scope.toggleMenuOpen = function() {
                /**
                * Whether the menu is open.
                *
                * @memberof navbar
                * @member {Boolean} menuOpen
                */
                $scope.menuOpen = !$scope.menuOpen;

              };
              /**
               * Takes a member to a view.
               *
               * @memberof navbar
               * @method gotoView
               */
              $scope.gotoView = function(view) {
                $rootScope.gotoView(view);
              };

              // If the inbox menu item is present, start the unread count update
              for(var i = 0; i < $scope.navbarDetails.menuItems.length; i++) {
                if($scope.navbarDetails.menuItems[i].link === '/inbox') {
                  $timeout($scope.getUnreadMessageCount, 120 * 1000);
                }
              }

              /**
               * Focuses on the search input.
               *
               * @memberof navbar
               * @method focusOnSearchInput
               */
              $scope.focusOnSearchInput = function() {
                angular.element('.input-search').focus();
              };

              $scope.toggleQueryHasFocus = function(booleanVal) {
                $scope.queryHasFocus = booleanVal;
                $scope.expandCommonDiv = false;
                $scope.expandSpecialtiesDiv = false;
              };

              // Type Ahead Functionality
              $scope.displayFlyout = function(query) {
                // reset scroll to top and highlight to false
                angular.element(".nav-bar-search-results-container")[0].scrollTop=0;
                $scope.highlightTextSpecialists = false;
                $scope.highlightTextProcedures = false;
                if (!query) {
                  return;
                }
                $scope.filterText = query;

                $scope.typeaheadInProgress = true;
                $http.get(config.typeaheadUrl + '?locale=en_us&search_term=' + query + '&network_id=' + $scope.selectedPlan.id + '&geo_location=' + (($rootScope.toggleOnOff) ? TransparencyFactory.getCurrentLocationZipCode() : TransparencyFactory.getCity().zip)).then(function(result) {
                  $scope.typeaheadError = false;
                  $scope.typeaheadInProgress = false;
                  $scope.typeaheadResults = result.data;
                  if (result.data &&
                    !result.data.procedures.length &&
                    !result.data.providers.length &&
                    !result.data.search_specialties.length) {
                    $rootScope.healthNavTrackStates(3, {searchTerm: query});
                  }
                })
                .catch(function(error) {
                  $scope.typeaheadInProgress = false;
                  $scope.typeaheadResults = null;
                  $scope.typeaheadError = true;
                });
              };

              $scope.expandCommonTerms = function() {
                $scope.expandCommonDiv = !$scope.expandCommonDiv;
              };

              $scope.expandSpecialties = function() {
                $scope.expandSpecialtiesDiv = !$scope.expandSpecialtiesDiv;
              };

              $scope.moreCommonTerms = function() {
                return $scope.findDoctorSearchDetails.commonSearchTerms? $scope.findDoctorSearchDetails.commonSearchTerms.commonSearchTerms.length > 3: false;
              };

              $scope.anyCommonTerms = function() {
                return $scope.findDoctorSearchDetails.commonSearchTerms? $scope.findDoctorSearchDetails.commonSearchTerms.commonSearchTerms.length > 0: false;
              };

              $scope.goToDetails = function(result){
                if (result.id && !result.provider_id){
                  TransparencyFactory.setResultsTerm(result.name);
                  $rootScope.gotoView('/find-doctor-search-results?searchTerm=' + result.name + '&id=' + result.id + '&network_id=' + $scope.selectedPlan.id + '&planName=' + $scope.selectedPlan.name);
                }else{
                  var searchTerm =  result.provider_id ? result.name : result;
                  TransparencyFactory.setResultsTerm(searchTerm);
                  $rootScope.gotoView('/find-doctor-search-results?name=' + searchTerm + '&network_id=' + $scope.selectedPlan.id + '&planName=' + $scope.selectedPlan.name);
                }
              };

              $scope.launchRefineSearch = function(query){
                if (!$scope.typeaheadInProgress && !$scope.typeaheadError && query
                    && ($scope.typeaheadResults._meta.counts.total.providers!==0
                    || $scope.typeaheadResults._meta.counts.total.search_specialties!==0)){
                  $scope.modalObj.peoplePlacesLength = $scope.typeaheadResults.providers.length;
                  $scope.modalObj.specialistsWhoLength = $scope.typeaheadResults.search_specialties.length;
                  TransparencyFactory.setSearchTerm(query);
                  TransparencyFactory.setResultsTerm(query);
                  $scope.openModal(query);
                }
              };

              $scope.refineSearchClick = function(event, query){
                if(event.key === 'Enter'){
                  $scope.launchRefineSearch(query);
                }
              };

              $scope.confirmModal  = function(data, userAction) {
                if (userAction === 'specialistsWho'){
                  $scope.highlightTextSpecialists = true;
                  $anchorScroll('specialistsWho');
                } else {
                  $rootScope.gotoView('/find-doctor-search-results?name=' + TransparencyFactory.getSearchTerm() + '&network_id=' + $scope.selectedPlan.id + '&planName=' + $scope.selectedPlan.name);
                }
              };
              $scope.modalObj = {
                modalTitle: $scope.findDoctorSearchDetails.modalTitle,
                modalText: $scope.findDoctorSearchDetails.modalText,
                peoplePlacesButton: {
                  title: $scope.findDoctorSearchDetails.peoplePlacesButtonTitle
                },
                specialistButton: {
                  title: $scope.findDoctorSearchDetails.specialistButtonTitle
                },
                values: {
                },
                peoplePlacesLength: null, 
                specialistsWhoLength: null
              };
            }
          ]
        };
      }
    ]);
}());
