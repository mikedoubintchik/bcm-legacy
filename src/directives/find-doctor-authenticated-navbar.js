/**
 * Directive for the find a doctor authenticated navbar.
 *
 * @namespace Directives
 * @class navbar
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.directives.findDoctorAuthenticatedNavbar', [])
    .directive('findDoctorAuthenticatedNavbar', ['$http', 'config',
      function($http, config) {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/find-doctor-authenticated-navbar.html',
          scope: {
            /**
            * Information for drawing the navbar.
            *
            * @memberof navbar
            * @member {Object} navbarDetails
            */
            navbarDetails: '=',
            findDoctorSearchDetails: '=',
            geoLocationDetails: '=',
            urgentCareDetails: '='
          },
          controller: [
            '$location',
            '$scope',
            '$http',
            '$rootScope',
            'languageService',
            'config',
            'TransparencyFactory',
            'geoLocationService',
            '$timeout',
            '$anchorScroll',
            'livechatService',
            function($location, $scope, $http, $rootScope, languageService, config, TransparencyFactory, geoLocationService, $timeout, $anchorScroll, livechatService) {
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.language = $rootScope.language || 'en';

              $scope.chatButtons = livechatService.getChatButtons();
              $scope.livechat = $rootScope.livechat;
            /*live chat functions*/

              $scope.liveChatUpdate = function() {

                $timeout(function(){

                  var chatAvailableBtns = document.getElementById("navbar-live-chat-available");
                  var chatNotAvailableBtns = document.getElementById("navbar-live-chat-not-available");
                    if ($rootScope.livechat && chatAvailableBtns && chatNotAvailableBtns) {
                      if (!$scope.livechat.value){
                        chatAvailableBtns.style.display='none';
                        chatNotAvailableBtns.style.display = '';
                      } else {
                        chatNotAvailableBtns.style.display = 'none';
                        chatAvailableBtns.style.display='';
                    }
                  }
                });
              };
              $scope.liveChatUpdate();

              $scope.startChat = function (buttonToken) {
                livechatService.openChat(buttonToken);
              };
              $scope.liveChatAlert = function () {
                livechatService.alert();
              };

              languageService.getLocale($scope.language).then(function(localeReturned) {
                $scope.loc = localeReturned;
              }).catch(console.warn);

              $scope.loggedIn = $rootScope.loggedIn;
              $scope.medicareUser = ($rootScope.loggedIn && $rootScope.selectedPolicy.sourceSystem === 'Amisys') ? true : false;
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
                $scope.highlightTextProcedures=false;
                $scope.queryHasFocus = true;
                $scope.expandProceduresDiv = false;
                $scope.expandSpecialtiesDiv = false;
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
               $scope.chatAvailableBtns = document.getElementById("navbar-live-chat-available");
               $scope.chatNotAvailableBtns = document.getElementById("navbar-live-chat-not-available");
               if ($rootScope.livechat && $scope.chatAvailableBtns && $scope.chatNotAvailableBtns) {
                 if (!$rootScope.livechat.value){
                   $scope.chatAvailableBtns.style.display='none';
                   $scope.chatNotAvailableBtns.style.display = '';
                 } else {
                   $scope.chatNotAvailableBtns.style.display = 'none';
                   $scope.chatAvailableBtns.style.display='';
                 }
               }
                $scope.menuOpen = !$scope.menuOpen;

              };
              /**
               * Takes a member to a view.
               *
               * @memberof navbar
               * @method gotoView
               */
              $scope.gotoView = function(view, i) {
                if (view === '/chatnow') {
                  var chatId = $scope.navbarDetails.menuItemsList.menuItems[i].index;
                  $scope.startChat($scope.chatButtons[chatId].token);
                } else if (view === '/chatalert') {
                  $scope.liveChatAlert();
                } else {
                  $rootScope.gotoView(view);
                }
              };



              $scope.gotoNavigatedPage = function(url, searchTerm) {
                if (!url && searchTerm !== $scope.loc.URGENT_CARE_HOME) {
                  return;
                }
                $scope.urltoNavigate = url;
                $scope.searchTermPassed = searchTerm;
                if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && $rootScope.noMatchPlanFound) {
                  return $rootScope.gotoView('/find-care');
                } else if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && !$rootScope.noMatchPlanFound) {
                  $scope.gotoBrowseLevelPage(url, searchTerm);
               } else {
                 if (navigator.geolocation) {
                   $rootScope.$emit('pageLoading');
                   $timeout(function(){
                     $rootScope.enableLocation = true;
                   }, 0)
                     .then(function(val) {
                       return geoLocationService.getLocation();
                     })
                     .then(function(response) {
                       $rootScope.$emit('pageLoaded');
                       if (response.data && response.data.zip) {
                         $rootScope.city = response.data;
                         $rootScope.city.cityFullName = $rootScope.city.city + $rootScope.city.state_code + ' - ' + $rootScope.city.zip;
                         $rootScope.currentCity = $rootScope.city;
                         $rootScope.distance = 25; // TODO default value, figure out how this really should be set
                         TransparencyFactory.setDistance($rootScope.distance);
                         TransparencyFactory.setCity($rootScope.city);
                         TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                         TransparencyFactory.setGeoLocationStatus(true);
                         TransparencyFactory.setLocationBlocked(false);
                         $rootScope.city.cityFullName = $scope.geoLocationDetails.distanceDetails.currentLocation;
                         if($rootScope.noMatchPlanFound){
                          $rootScope.gotoView('/find-care');
                        } else {
                          $scope.gotoBrowseLevelPage(url, searchTerm);
                        }
                       } else if (response === 'position not found') {
                         TransparencyFactory.setLocationBlocked(true);
                         TransparencyFactory.setGeoLocationStatus(false);
                         TransparencyFactory.setLocationMsg($scope.geoLocationDetails.locationMsg);
                         $scope.modalObj.values.NCZipCheck = $rootScope.selectedPlan.isNorthCarolinaPlan;
                         $scope.openModal();
                       } else {
                         TransparencyFactory.setLocationBlocked(false);
                         TransparencyFactory.setGeoLocationStatus(false);
                         $rootScope.$emit('pageLoaded');
                         $scope.modalObj.values.locationNotFound = true;
                         $scope.openModal();
                       }
                     })
                     .catch(function(error) {
                       TransparencyFactory.setLocationBlocked(false);
                       $rootScope.$emit('pageLoaded');
                       $scope.modalObj.values.locationNotFound = true;
                       $scope.openModal();
                     });
                 } else {
                   $rootScope.$emit('pageLoaded');
                   TransparencyFactory.setLocationBlocked(true);
                   TransparencyFactory.setLocationMsg($scope.geoLocationDetails.locationMsg);
                   $scope.modalObj.values.NCZipCheck = $rootScope.selectedPlan.isNorthCarolinaPlan;
                   $scope.openModal();
                 }
               }
              };

              /**
               * Based on the user selection, go to the url with planName, zipCode, distance and search term
               *
               * @memberof findDoctorSearch
               * @method gotoBrowseLevelPage
               */
              $scope.gotoBrowseLevelPage = function(url, searchTerm) {
                $rootScope.city = (!$rootScope.city) ? $rootScope.newCity : $rootScope.city;
                if (searchTerm === $scope.loc.URGENT_CARE_HOME) { // if the selection in the browse level one have id go to reults page
                  TransparencyFactory.setResultsTerm(searchTerm);
                  $rootScope.gotoView('/find-doctor-search-results?id=' + $scope.urgentCareDetails[0].id + '&network_id=' + $rootScope.selectedPlan.id + '&distance=' + TransparencyFactory.getDistance() + '&searchTerm='+ searchTerm );
                } else {
                  TransparencyFactory.setSearchTerm(searchTerm);
                  $rootScope.gotoView(url + '?searchTerm='+ searchTerm + '&planName='+ $rootScope.selectedPlan.lobDesc + '&zipCode=' + TransparencyFactory.getCity().zip + '&distance=' + TransparencyFactory.getDistance() + '&planId=' + $rootScope.selectedPlan.id);
                }
              }; // end of gotoBrowseLevelPage function


             $scope.confirmFunc = function(data) {
               $rootScope.city = data.city;
               $rootScope.distance = data.distance;
               TransparencyFactory.setDistance($rootScope.distance);
               TransparencyFactory.setCity($rootScope.city);
               TransparencyFactory.setGeoLocationStatus(false);
               if ($rootScope.noMatchPlanFound){
                $rootScope.gotoView('/find-care');
              } else {
                $scope.gotoBrowseLevelPage($scope.urltoNavigate, $scope.searchTermPassed);
              }
             };

             $scope.modalObj = {
               locationMsg: $scope.geoLocationDetails.locationMsg,
               cancelButton: {
                 title: $scope.loc.CANCEL
               },
               confirmButton: {
                 title: $scope.loc.CONTINUE
               },
               values: {
                 distanceDetails: $scope.geoLocationDetails.distanceDetails,
                 distance : (TransparencyFactory.getDistance()) ? TransparencyFactory.getDistance().toString() : $scope.geoLocationDetails.distanceDetails.distance.toString(),
                 city: TransparencyFactory.getCity()
               }
             };

              // If the inbox menu item is present, start the unread count update
              for(var i = 0; i < $scope.navbarDetails.menuItemsList.length; i++) {
                if($scope.navbarDetails.menuItemsList[i].link === '/inbox') {
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
                $scope.expandProceduresDiv = false;
              };

              // Type Ahead Functionality
              $scope.displayFlyout = function(query) {
                // reset scroll to top and highlight to false
                angular.element(".nav-bar-search-results-container")[0].scrollTop=0;
                $scope.highlightTextSpecialists = false;
                $scope.highlightTextProcedures = false;
                if (!query) {
                  $scope.showTypeAhead = false;
                  $scope.showCommonSearch = true;
                  $scope.typeaheadError = false;
                  $scope.queryHasFocus = true;
                  return;
                }
                $scope.filterText = query;

                $scope.typeaheadInProgress = true;
                $scope.showTypeAhead = true;
                $scope.showCommonSearch = false;
                var endPoint = ($scope.loggedIn && !$rootScope.noMatchPlanFound) ? 'procedures?locale=en_us&search_term=' : '?locale=en_us&search_term=';
                endPoint = endPoint + query + '&member_number=' + $scope.selectedPlan.alphaPrefix + $scope.selectedPlan.externalId + '&network_id=' + $scope.selectedPlan.id +
                  (
                    $scope.selectedPlan.policyMembers ?
                      '&dob=' + $scope.selectedPlan.policyMembers[0].birthDate.slice(0, 10):
                      ''
                  );
                if ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) {
                  $http.post(
                    config.typeaheadUrl + endPoint,
                    {
                      jwt: $rootScope.vitalsJWT,
                      signature: $rootScope.vitalsSignature,
                      geo_location: ($rootScope.toggleOnOff) ? TransparencyFactory.getCurrentLocationZipCode() : TransparencyFactory.getCity().zip
                    }
                  ).then(function(result) {
                    $scope.typeaheadInProgress = false;
                    $scope.typeaheadResults = result.data;
                    $scope.typeaheadError = false;
                    if (result.data &&
                      !result.data.procedures.length &&
                      !result.data.providers.length &&
                      !result.data.search_specialties.length) {
                      $rootScope.healthNavTrackStates(3, {searchTerm: query});
                    }
                  })
                    .catch(function(error) {
                      $scope.typeaheadError = true;
                      $scope.typeaheadInProgress = false;
                    });
                } else {
                  $http.get(config.typeaheadUrl + endPoint).then(function(result) {
                    $scope.typeaheadInProgress = false;
                    $scope.typeaheadResults = result.data;
                    $scope.typeaheadError = false;
                    if (result.data &&
                      !result.data.procedures.length &&
                      !result.data.providers.length &&
                      !result.data.search_specialties.length) {
                      $rootScope.healthNavTrackStates(3, {searchTerm: query});
                    }
                  })
                    .catch(function(error) {
                      $scope.typeaheadError = true;
                      $scope.typeaheadInProgress = false;
                      $scope.typeaheadResults = null;
                      $scope.typeaheadError = true;
                    });
                }
              };

              $scope.expandCommonTerms = function() {
                $scope.expandCommonDiv = !$scope.expandCommonDiv;
              };

              $scope.expandSpecialties = function() {
                $scope.expandSpecialtiesDiv = !$scope.expandSpecialtiesDiv;
              };

              $scope.expandProcedures = function() {
                $scope.expandProceduresDiv = !$scope.expandProceduresDiv;
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
                if ($scope.typeaheadResults && !$scope.typeaheadInProgress && !$scope.typeaheadError && query
                    && ($scope.typeaheadResults._meta.counts.total.providers!==0
                    || $scope.typeaheadResults._meta.counts.total.search_specialties!==0
                    || $scope.typeaheadResults._meta.counts.total.procedures!==0)){
                  $scope.modalObj.peoplePlacesLength = $scope.typeaheadResults.providers.length;
                  $scope.modalObj.specialistsWhoLength = $scope.typeaheadResults.search_specialties.length;
                  $scope.modalObj.providersPerformLength = $scope.typeaheadResults.procedures.length;
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
                if (userAction === 'specialistsWho') {
                  $scope.highlightTextSpecialists = true;
                  $scope.highlightTextProcedures = false;
                  $anchorScroll('search_specialties');
                } else if (userAction === 'providersPerform') {
                  $scope.highlightTextProcedures = true;
                  $scope.highlightTextSpecialists = false;
                  $anchorScroll('procedures');
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
                procedureButton: {
                  title: $scope.findDoctorSearchDetails.procedureButtonTitle
                },
                values: {
                },
                peoplePlacesLength: null,
                specialistsWhoLength: null,
                providersPerformLength: null
              };
            }
          ]
        };
      }
    ]);
}());
