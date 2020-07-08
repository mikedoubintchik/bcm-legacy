/**
 * Directive for a help item group on the help page.
 *
 * @namespace Directives
 * @class helpItemGroup
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.helpItemGroup', [])
  .directive('helpItemGroup', ['livechatService',
    function(livechatService) {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/help-item-group.html',
        scope: {
          /**
          * Display information for the help item group.
          *
          * @memberof helpItemGroup
          * @member {Object} groupDetails
          */
          groupDetails: '=',
          urgentCareDetails: '=',
          geoLocationDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$timeout',
          'quickAlertService',
          'TransparencyFactory',
          'geoLocationService',
          'analyticConstants',
          'config',
          'livechatService',
          function($scope, $rootScope, $location, $timeout, quickAlertService, TransparencyFactory, geoLocationService, analyticConstants, config, livechatService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
            $rootScope.selectedPlan = TransparencyFactory.getSelectedPlan();
            $scope.urltoNavigate = null;
            $scope.searchTermPassed = null;
            $scope.livechat = $rootScope.livechat;
            var chatAvailableBtns = null;
            var chatNotAvailableBtns = null;
            $scope.chatButtons = livechatService.getChatButtons();

            $rootScope.$watch("livechat.value", function(newVal, oldVal) {
              if (newVal !== oldVal && $location.path() === '/help') {
                if ($rootScope.livechat && !$rootScope.livechat.value) {
                    chatAvailableBtns.style.display='none';
                    chatNotAvailableBtns.style.display = '';
                  } else {
                    chatNotAvailableBtns.style.display = 'none';
                    chatAvailableBtns.style.display='';
                  }
              }
            }, true);

            $scope.liveChatUpdate = function() {

              $timeout(function(){
  
                chatAvailableBtns = document.getElementById("live-chat-available");
                chatNotAvailableBtns = document.getElementById("live-chat-not-available");
                if ($rootScope.livechat && !$scope.livechat.value){
                  chatAvailableBtns.style.display='none';
                  chatNotAvailableBtns.style.display = '';
                } else {
                  chatNotAvailableBtns.style.display = 'none';
                  chatAvailableBtns.style.display='';
                }
              });
            };
            if($rootScope.liveChatIntialized) {
              $scope.liveChatUpdate();
            }


            $scope.startChat = function (buttonToken) {
              livechatService.openChat(buttonToken);
            };
            $scope.liveChatAlert = function () {
              livechatService.alert();
            }; 

            $scope.gotoSSO = function(ssoLink) {
              return $rootScope.openInSecureBrowser(ssoLink);
            };
            $timeout(function() {
              if ($rootScope.vitalsDown) {
                $rootScope.vitalsDown = false;
                return $scope.openAlertModal();
              }
            });

            $scope.checkForSso = function(link, searchTerm, isExternalLink, index) {

              if (searchTerm) {
                $rootScope.healthNavTrackActions(4, {searchTerm: searchTerm}, analyticConstants.HELP_SECTION);
              }

              if (link === '/chatnow') {
                $scope.startChat( $scope.chatButtons[index].token);                                    
              } else if (link === '/chatalert') {
                $scope.liveChatAlert();
              } else if (link.startsWith('sso')) {
                $scope.gotoSSO(link);
              } else {
                $scope.navigatePageRequested(link, searchTerm, isExternalLink);
              }
            };

            $scope.navigatePageRequested = function (url, searchTerm, isExternalLink) {
              // External link?
              if (isExternalLink) {
                return $scope.openInBrowser(url, '_blank', {});
              }
              if (url === '/chat') {
                var bsbcUrl = config.bcbsWebUrl;
                return $scope.openInBrowser(bsbcUrl);
              } else if (!$rootScope.loggedIn) {
                if ($rootScope.vitalsError && url === '/find-doctor') {
                  return $scope.openAlertModal();
                }
                $rootScope.gotoView(url);
              } else if (!$rootScope.selectedPlan.active) {
                if ($rootScope.vitalsError && url === '/find-doctor-browser') {
                  $scope.openAlertModal();
                  return;
                }
                $rootScope.gotoView(url !== '/find-doctor-browser' ? url : '/fad-auth/find-doctor');
              } else {
                $scope.urltoNavigate = url;
                $scope.searchTermPassed = searchTerm;
                if (!url && searchTerm !== $scope.loc.URGENT_CARE_HOME) {
                 /* noop */
                } else if (url != '/find-doctor-browser' && searchTerm !== $scope.loc.URGENT_CARE_HOME) {
                  $rootScope.gotoView(url);
                } else {
                  if ($rootScope.vitalsError) {
                    $scope.openAlertModal();
                    return;
                  }
                  if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && $rootScope.noMatchPlanFound){
                    return $rootScope.gotoView('/find-care');
                  } 
                  if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && !$rootScope.noMatchPlanFound) {
                    $scope.gotoBrowseLevelPage(url, searchTerm);
                  } else {
                    TransparencyFactory.setZipRangeNC($scope.geoLocationDetails.distanceDetails.NCZipMin,$scope.geoLocationDetails.distanceDetails.NCZipMax);
                    if (navigator.geolocation) {
                      $rootScope.$emit('pageLoading');
                      $timeout(function () {
                        $rootScope.enableLocation = true;
                      }, 0)
                          .then(function () {
                            return geoLocationService.getLocation();
                          })
                          .then(function (response) {
                            $rootScope.$emit('pageLoaded');
                            if (response.data && response.data.zip) {
                              $rootScope.city = response.data;
                              $rootScope.city.cityFullName = $rootScope.city.city + $rootScope.city.state_code + ' - ' + $rootScope.city.zip;
                              $rootScope.currentCity = $rootScope.city;
                              $rootScope.distance = 25; // TODO default value, figure out how this really should be set
                              $rootScope.vitalsGeoCoords = response.data.geo;
                              TransparencyFactory.setDistance($rootScope.distance);
                              TransparencyFactory.setCity($rootScope.city);
                              TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                              TransparencyFactory.setGeoLocationStatus(true);
                              TransparencyFactory.setLocationBlocked(false);
                              $rootScope.city.cityFullName = $scope.geoLocationDetails.distanceDetails.currentLocation;
                              if ($rootScope.noMatchPlanFound){
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
                          .catch(function () {
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
              $rootScope.openMapView = false;
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

          $scope.alertModalObj = {
            title: $scope.groupDetails.alertModal && $scope.groupDetails.alertModal.title ? $scope.groupDetails.alertModal.title : '',
            message: $scope.groupDetails.alertModal && $scope.groupDetails.alertModal.message ? $scope.groupDetails.alertModal.message : '',
            confirmBtn: $scope.groupDetails.alertModal && $scope.groupDetails.alertModal.confirmBtn ? $scope.groupDetails.alertModal.confirmBtn : '',
          };

            /**
             * Toggles the quick-alert-modal for sent message if messageSent is true
             *
             * @memberof helpItemGroup
             */
             if ($location.search().messageSent) {
               $rootScope.sentMessage = true;
               quickAlertService.showQuickAlert({message: $rootScope.loc.MESSAGE_SENT, color: 'green'});
               $timeout(function() {
                   angular.element('.quick-alert-modal').hide();
               }, 2000);
               var search = angular.copy($location.search());
               delete search.messageSent;
               $location.search(search);
             }
          }
        ],
        // link: function($scope, $elem) {
        //   livechatService.registerButton( $elem.find("[name='live-chat-available-button']").context, 0);
        //   livechatService.registerButton( $elem.find(["name='live-chat-not-available-button'"]).context, 1);
        // }
      };
    }
  ]
);
}());
