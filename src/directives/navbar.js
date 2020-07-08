/**
 * Directive for the main navbar.
 *
 * @namespace Directives
 * @class navbar
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.navbar', [])
    .directive('navbar', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/navbar.html',
          scope: {
            /**
             * Information for drawing the navbar.
             *
             * @memberof navbar
             * @member {Object} navbarDetails
             */
            navbarDetails: '=',
            urgentCareDetails: '=',
            geoLocationDetails: '=',
          },
          controller: [
            '$location',
            '$scope',
            '$rootScope',
            '$sce',
            '$timeout',
            'livechatService',
            'messageService',
            'alertService',
            'adobeService',
            'coachmarkService',
            'PaymentFlowFactory',
            'TransparencyFactory',
            'geoLocationService',
            'config',
            function(
              $location,
              $scope,
              $rootScope,
              $sce,
              $timeout,
              livechatService,
              messageService,
              alertService,
              adobeService,
              coachmarkService,
              PaymentFlowFactory,
              TransparencyFactory,
              geoLocationService,
              config
            ) {
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.urltoNavigate = null;
              $scope.searchTermPassed = null;
              $scope.livechatIsAvailable = false;
              $scope.loc = $rootScope.loc;
              $scope.memberInitializedLiveChat = false;
              $scope.chatButtons = livechatService.getChatButtons();

              $scope.startChat = function (buttonToken) {
                livechatService.openChat(buttonToken);
              };
              $scope.liveChatAlert = function () {
                livechatService.alert();
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
               * Returns whether the current view is the home view.
               *
               * @memberof navbar
               * @method viewIsHome
               * @return {Boolean} Whether the view is '/' or '/home'.
               */
              $scope.viewIsHome = function() {
                return $rootScope.getViewUrl() === '/' || $rootScope.getViewUrl() === '/home';
              };

              /**
               * Toggles the menu drawer.
               *
               * @memberof navbar
               * @method toggleMenuOpen
               */
              $scope.toggleMenuOpen = function() {
                if ($rootScope.liveChatIntialized && $rootScope.selectedPolicy.active && !$rootScope.selectedPolicy.isVision && !$rootScope.selectedPolicy.isDental) {
                  $scope.chatAvailableBtns = document.getElementById("navbar-live-chat-available");
                  $scope.chatNotAvailableBtns = document.getElementById("navbar-live-chat-not-available");
                  if ($rootScope.livechat && $scope.chatAvailableBtns && $scope.chatNotAvailableBtns) {
                    if (!$rootScope.livechat.value ){
                      $scope.chatAvailableBtns.style.display='none';
                      $scope.chatNotAvailableBtns.style.display = '';
                    } else {
                      $scope.chatNotAvailableBtns.style.display = 'none';
                      $scope.chatAvailableBtns.style.display='';
                    }
                  }
                }


                $scope.trackButtonAction('homeMenu:' + ($scope.menuOpen ? 'close' : 'open'));

                $rootScope.closePolicySelect();
                $scope.menuOpen = !$scope.menuOpen;
                $rootScope.blurContent = $scope.menuOpen;
                if ($scope.menuOpen) {
                  coachmarkService.showCoachmarks('menu');
                }
              };
              $rootScope.toggleMenuOpen = $scope.toggleMenuOpen;

              $scope.menuIsOpen = function() {
                return $scope.menuOpen;
              };
              $rootScope.menuIsOpen = $scope.menuIsOpen;

              $scope.trackButtonAction = function(action) {
                var section = $location.path().split('/')[1];

                section = section[0].toUpperCase() + section.slice(1);
                adobeService.trackAction(action, section);
              };

              /**
               * Returns the current page title as trusted HTML.
               *
               * @memberof navbar
               * @method getPageTitle
               * @return {Object} The trusted HTML object.
               */
              $scope.getPageTitle = function() {
                return $sce.trustAsHtml($rootScope.pageTitle);
              };

              /**
               * Retrieves the unread inbox messge count on a 120 second interval.
               *
               * @memberof navbar
               * @method getUnreadMessageCount
               */
              $scope.getUnreadMessageCount = function() {
                messageService.getCounts().then(function(counts) {
                  for (var i = 0; i < $scope.navbarDetails.menuItems.length; i++) {
                    if ($scope.navbarDetails.menuItems[i].link === '/inbox') {
                      $scope.navbarDetails.menuItems[i].badge = counts.unreadMessages;
                      $timeout($scope.getUnreadMessageCount, 120 * 1000);
                      break;
                    }
                  }
                });
              };

              /**
               * Takes a member to a view.
               *
               * @memberof navbar
               * @method gotoView
               */
              $scope.gotoView = function(view, i) {
                if (view === 'menu'){
                  view = $scope.navbarDetails.menuItems[i].link;
                }
                if (view === '/help') {
                  $scope.trackButtonAction('help');
                }

                if (view === '/logout') {
                  return alertService
                    .showAlert(
                      $rootScope.loc.LOG_OUT_CONFIRM,
                      null,
                      { title: $rootScope.loc.LOG_OUT, color: 'red' },
                      { title: $rootScope.loc.CANCEL }
                    )
                    .then(function() {
                      $rootScope.logOut();
                    });
                }

                if (/payment/.test($location.url())) {
                  PaymentFlowFactory.reset();
                }

                if (view === '/chatnow') {
                  var chatId = $scope.navbarDetails.menuItems[i].index;
                  $scope.startChat($scope.chatButtons[chatId].token);                                   
                } else if (view === '/chatalert') {
                  $scope.liveChatAlert();
                } else {
                  $rootScope.gotoView(view);
                }
              };

              $scope.gotoNavigatedPage = function(url, searchTerm, isExternalLink) {
                // External link?
                if (isExternalLink) {
                  $scope.gotoExternalLink(url);
                } else {
                  $scope.gotoInternalPage(url, searchTerm);
                }
              };

              $scope.gotoExternalLink = function(url) {
                return $rootScope.openInBrowser(url, '_blank', {});
              };

              $scope.gotoInternalPage = function(url, searchTerm) {

                if (!url && searchTerm !== $scope.loc.URGENT_CARE_HOME) {
                  return;
                }
                if ($rootScope.vitalsError) {
                  $scope.openAlertModal();
                  return;
                }
                $scope.urltoNavigate = url;
                $scope.searchTermPassed = searchTerm;
                if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && $rootScope.noMatchPlanFound) {
                  return $rootScope.gotoView('/find-care');
                } else if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && !$rootScope.noMatchPlanFound) {
                  $scope.gotoBrowseLevelPage(url, searchTerm);
                } else {
                  TransparencyFactory.setZipRangeNC(
                    $scope.geoLocationDetails.distanceDetails.NCZipMin,
                    $scope.geoLocationDetails.distanceDetails.NCZipMax
                  );
                  if (navigator.geolocation) {
                    $rootScope.$emit('pageLoading');
                    $timeout(function() {
                      $rootScope.enableLocation = true;
                    }, 0)
                      .then(function() {
                        return geoLocationService.getLocation();
                      })
                      .then(function(response) {
                        $rootScope.$emit('pageLoaded');
                        if (response.data && response.data.zip) {
                          $rootScope.city = response.data;
                          $rootScope.city.cityFullName = $rootScope.city.city + $rootScope.city.state_code + ' - ' + $rootScope.city.zip;
                          $rootScope.currentCity = $rootScope.city;
                          $rootScope.vitalsGeoCoords = response.data.geo;
                          $rootScope.distance = 25; // TODO default value, figure out how this really should be set
                          TransparencyFactory.setDistance($rootScope.distance);
                          TransparencyFactory.setCity($rootScope.city);
                          TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                          TransparencyFactory.setGeoLocationStatus(true);
                          TransparencyFactory.setLocationBlocked(false);
                          $rootScope.city.cityFullName = $scope.geoLocationDetails.distanceDetails.currentLocation;
                          if ($rootScope.noMatchPlanFound) {
                            $rootScope.gotoView('/find-care');
                          } else {
                            $scope.gotoBrowseLevelPage(url, searchTerm);
                          }
                        } else if (response === 'position not found') {
                          TransparencyFactory.setLocationBlocked(true);
                          TransparencyFactory.setGeoLocationStatus(false);
                          TransparencyFactory.setLocationMsg($scope.geoLocationDetails.locationMsg);
                          $scope.modalObj.values.NCZipCheck =
                          $rootScope.selectedPlan.isNorthCarolinaPlan;
                          $scope.openModal();
                        } else {
                          TransparencyFactory.setLocationBlocked(false);
                          TransparencyFactory.setGeoLocationStatus(false);
                          $rootScope.$emit('pageLoaded');
                          $scope.modalObj.values.locationNotFound = true;
                          $scope.openModal();
                        }
                      })
                      .catch(function() {
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

              $scope.alertModalObj = {
                title: $scope.navbarDetails.alertModal && $scope.navbarDetails.alertModal.title ? $scope.navbarDetails.alertModal.title : '',
                message: $scope.navbarDetails.alertModal && $scope.navbarDetails.alertModal.message ? $scope.navbarDetails.alertModal.message : '',
                confirmBtn: $scope.navbarDetails.alertModal && $scope.navbarDetails.alertModal.confirmBtn ? $scope.navbarDetails.alertModal.confirmBtn : '',
              };

              /**
               * Based on the user selection, go to the url with planName, zipCode, distance and search term
               *
               * @memberof findDoctorSearch
               * @method gotoBrowseLevelPage
               */
              $scope.gotoBrowseLevelPage = function(url, searchTerm) {
                $rootScope.openMapView = false;
                $rootScope.city = (!$rootScope.city) ? $rootScope.newCity : $rootScope.city;
                if ($scope.navbarDetails.selectedPolicy.active) {
                  if (searchTerm === $scope.loc.URGENT_CARE_HOME) {
                    // if the selection in the browse level one have id go to results page
                    TransparencyFactory.setResultsTerm(searchTerm);
                    $rootScope.gotoView(
                      '/find-doctor-search-results?id=' +
                        $scope.urgentCareDetails[0].id +
                        '&network_id=' +
                        $rootScope.selectedPlan.id +
                        '&distance=' +
                        TransparencyFactory.getDistance() +
                        '&searchTerm=' +
                        searchTerm
                    );
                  } else {
                    TransparencyFactory.setSearchTerm(searchTerm);
                    $rootScope.gotoView(
                      url +
                        '?searchTerm=' +
                        searchTerm +
                        '&planName=' +
                        $rootScope.selectedPlan.lobDesc +
                        '&zipCode=' +
                        TransparencyFactory.getCity().zip +
                        '&distance=' +
                        TransparencyFactory.getDistance() +
                        '&planId=' +
                        $rootScope.selectedPlan.id
                    );
                  }
                } else {
                  //if the policy is not active redirect to search landing page
                  $rootScope.gotoView('/fad-auth/find-doctor');
                }
              }; // end of gotoBrowseLevelPage function

              $scope.confirmFunc = function(data) {
                $rootScope.city = data.city;
                $rootScope.distance = data.distance;
                TransparencyFactory.setDistance($rootScope.distance);
                TransparencyFactory.setCity($rootScope.city);
                TransparencyFactory.setGeoLocationStatus(false);
                if ($rootScope.noMatchPlanFound) {
                  $rootScope.gotoView('/find-care');
                } else {
                  $scope.gotoBrowseLevelPage($scope.urltoNavigate, $scope.searchTermPassed);
                }
              };

              $scope.modalObj = {
                locationMsg: $scope.geoLocationDetails.locationMsg,
                cancelButton: {
                  title: $scope.loc.CANCEL,
                },
                confirmButton: {
                  title: $scope.loc.CONTINUE,
                },
                values: {
                  distanceDetails: $scope.geoLocationDetails.distanceDetails,
                  distance: TransparencyFactory.getDistance()
                    ? TransparencyFactory.getDistance().toString()
                    : $scope.geoLocationDetails.distanceDetails.distance.toString(),
                  city: TransparencyFactory.getCity(),
                },
              };

              $scope.returnFADLinks = function() {
                if (!$scope.navbarDetails.selectedPolicy.active) {
                  $scope.navbarDetails.findCareItems.forEach(function(element) {
                    if (!element.externalLink) {
                      element.link = '/fad-auth/find-doctor';
                    }
                  });
                }
                return $scope.navbarDetails.findCareItems;
              };

              // If the inbox menu item is present, start the unread count update
              for (var i = 0; i < $scope.navbarDetails.menuItems.length; i++) {
                if ($scope.navbarDetails.menuItems[i].link === '/inbox') {
                  $timeout($scope.getUnreadMessageCount, 120 * 1000);
                }
              }
            },
          ],
        };
      },
    ])
    .directive('findDoctorNavbarListItem', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/find-doctor-list-item.html',
          scope: {
            name: '@',
            title: '@',
            icon: '@',
            description: '@',
            externalLink: '@?',
            link: '@',
            toggleMenuOpen: '<',
            gotoNavigatedPage: '<',
          },
          controller: [
            '$rootScope',
            '$scope',
            function($rootScope, $scope) {
              $scope.gotoView = $rootScope.gotoView;

              /**
               * Pass through method to external links for drug benefits
               *
               * @memberof homeCardBenefits
               * @method gotoDrugBenefits
               */
              $scope.gotoSSO = function(ssoLink) {
                return $rootScope.openInSecureBrowser(ssoLink);
              };

              $scope.checkForSso = function(link, description, isExternalLink) {
                $rootScope.healthNavTrackActions(
                  0,
                  { title: 'guided search: ' + description, searchTerm: description },
                  'Menu'
                );
                // Check sso.
                if (link.startsWith('sso')) {
                  $scope.gotoSSO(link);
                } else {
                  $scope.gotoNavigatedPage(link, description, isExternalLink);
                }
              };
            },
          ],
        };
      },
    ]);
})();
