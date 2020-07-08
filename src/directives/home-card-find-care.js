/**
 * Directive for the  Find Care card on the home screen.
 *
 * @namespace Directives
 * @class homeCardFindCare
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardFindCare', [])
    .directive('homeCardFindCare', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/home-card-find-care.html',
          scope: {
            /**
            * Display information for the find care
            *
            * @memberof homeCardFindCare
            * @member {Object} findCareDetails
            */
            findCareDetails: '=',
            geoLocationDetails: '=',
            jwt: '=?',
            signature: '=?',
            smartShopperDetails: '=',
          },
          controller: [
            '$scope',
            '$rootScope',
            '$timeout',
            'TransparencyFactory',
            'geoLocationService',
            'helpService',
            'analyticConstants',
            function($scope, $rootScope, $timeout, TransparencyFactory, geoLocationService, helpService, analyticConstants) {
              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;
              $scope.trackState = $rootScope.trackState;
              $scope.trackAction = $rootScope.trackAction;
              $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
              $rootScope.selectedPlan = TransparencyFactory.getSelectedPlan();
              $rootScope.isSmartShopperEligible = ($rootScope.loggedIn && $scope.findCareDetails.isSmartShopperEligible);
              $scope.language = $rootScope.language;

              if ($scope.jwt) {
                console.log('storing jwt', $scope.jwt.substr(0, 5));
                $rootScope.vitalsJWT = $scope.jwt;
              }
              if ($scope.signature) {
                console.log('storing signature');
                $rootScope.vitalsSignature = $scope.signature;
              }

              /**
              * Based on the row size it will display the items from careDetails
              * Dividing the customerDetails object into rows
              *
              * @memberof homeCardCareDetails
              * @method getRowContent
              **/

              var rowSize = 2;

              $scope.hasOddItems = function(items) {
                return !(items.length % 2 === 0);
              };

              $scope.careDetailsRow = ($scope.findCareDetails.links) ? getRowContent($scope.findCareDetails.links, rowSize) : null;

              function getRowContent(source, size) {
                var data = [];
                while (source.length > 0) {
                  data.push(source.splice(0, size));
                }
                return data;
              }

              $scope.gotoSSO = function(ssoLink) {
                return $rootScope.openInSecureBrowser(ssoLink);
              };

              $scope.checkForSso = function(link, searchTerm, description, isExternalLink) {
                $rootScope.healthNavTrackActions(4, { searchTerm: searchTerm }, analyticConstants.HOME_SECTION);
                if (link.startsWith('sso')) {
                  $scope.gotoSSO(link);
                } else {
                  $scope.gotoNavigatedPage(link, searchTerm, description, isExternalLink);
                }
              };

              $scope.gotoNavigatedPage = function(url, searchTerm, planDetails, isExternalLink) {
                // External link?
                if (isExternalLink) {
                  return $rootScope.openInBrowser(url, '_blank', {});
                }

                if (!url && searchTerm !== $scope.loc.URGENT_CARE_HOME) {
                  return;
                }
                $scope.urltoNavigate = url;
                $scope.searchTermPassed = searchTerm;
                $scope.planDetails = planDetails;
                if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && $rootScope.noMatchPlanFound) {
                  return $rootScope.gotoView('/find-care');
                }
                if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && !$rootScope.noMatchPlanFound) {
                  $scope.gotoBrowseLevelPage(url, searchTerm, planDetails);
                } else {
                  TransparencyFactory.setZipRangeNC($scope.geoLocationDetails.distanceDetails.NCZipMin, $scope.geoLocationDetails.distanceDetails.NCZipMax);
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
                          TransparencyFactory.setGeoLocationStatus(true);
                          TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                          TransparencyFactory.setLocationBlocked(false);
                          $rootScope.city.cityFullName = $scope.geoLocationDetails.distanceDetails.currentLocation;
                          if ($rootScope.noMatchPlanFound) {
                            $rootScope.gotoView('/find-care');
                          } else {
                            $scope.gotoBrowseLevelPage(url, searchTerm, planDetails);
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


              $scope.confirmFunc = function(data) {
                $rootScope.city = data.city;
                $rootScope.distance = data.distance;
                TransparencyFactory.setDistance($rootScope.distance);
                TransparencyFactory.setCity($rootScope.city);
                TransparencyFactory.setGeoLocationStatus(false);
                if ($rootScope.noMatchPlanFound) {
                  $rootScope.gotoView('/find-care');
                } else {
                  $scope.gotoBrowseLevelPage($scope.urltoNavigate, $scope.searchTermPassed, $scope.planDetails);
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
                  distance: (TransparencyFactory.getDistance()) ? TransparencyFactory.getDistance().toString() : $scope.geoLocationDetails.distanceDetails.distance.toString(),
                  city: TransparencyFactory.getCity()
                }
              };

              $scope.gotoBrowseLevelPage = function(url, searchTerm, planDetails) {
                $rootScope.openMapView = false;
                $rootScope.city = (!$rootScope.city) ? $rootScope.newCity : $rootScope.city;
                if (searchTerm === $scope.loc.URGENT_CARE_HOME) { // if the selection in the browse level one have id go to reults page
                  TransparencyFactory.setResultsTerm(searchTerm);
                  $rootScope.gotoView('/find-doctor-search-results?id=' + $scope.findCareDetails.urgentCareDetails[0].id + '&network_id=' + $rootScope.selectedPlan.id + '&distance=' + planDetails.distance + '&searchTerm=' + searchTerm);
                } else {
                  TransparencyFactory.setSearchTerm(searchTerm);
                  $rootScope.gotoView(url + '?searchTerm=' + searchTerm + '&planName=' + planDetails.planName + '&zipCode=' + TransparencyFactory.getCity().zip + '&distance=' + TransparencyFactory.getDistance() + '&planId=' + $rootScope.selectedPlan.id + '&smartShopperFlow=' + planDetails.acceptedSmartShopperTerms);
                }
              };

              $scope.alertModalObj = {
                title: $scope.findCareDetails.title || '',
                message: $scope.findCareDetails.message || '',
                confirmBtn: $scope.findCareDetails.confirmBtn || '',
                cancelBtn: $scope.findCareDetails.cancelBtn || '',
              };

              $scope.termsModalObj = $scope.smartShopperDetails.acceptTermsModal;

              $rootScope.vitalsError = $scope.findCareDetails.vitalsError ? $scope.findCareDetails.vitalsError : false;

              $scope.checkVitalsUp = function() {
                if (!$scope.findCareDetails.showSearchNav && !$scope.findCareDetails.vitalsError) {
                  return;
                } else if (!$scope.findCareDetails.vitalsError && $scope.findCareDetails.showSearchNav) {
                  $scope.gotoView('/fad-auth/find-doctor');
                } else if ($scope.findCareDetails.vitalsError) {
                  $scope.openAlertModal();
                }
              };

              $scope.openInfoModal = function() {
                $rootScope.headerTerm = $scope.smartShopperDetails.infoModalHeader;
                $scope.helpInfo = {
                  introText_1: $scope.smartShopperDetails.infoModalBody.introText_1,
                  introText_2: $scope.smartShopperDetails.infoModalBody.introText_2,
                  title: $scope.smartShopperDetails.infoModalBody.title,
                  contents: [
                    {
                      title: $scope.smartShopperDetails.infoModalBody.heading_1,
                      text: $scope.smartShopperDetails.infoModalBody.text_1,
                    },
                    {
                      title: $scope.smartShopperDetails.infoModalBody.heading_2,
                      text: $scope.smartShopperDetails.infoModalBody.text_2,
                    },
                    {
                      title: $scope.smartShopperDetails.infoModalBody.heading_3,
                      text: $scope.smartShopperDetails.infoModalBody.text_3,
                    }
                  ],
                  smartShopperInfo: true,
                };
                helpService.help($scope.helpInfo);
              };

              $scope.confirmTermsFunc = function() {
                $rootScope.smartShopperTermsAccepted = true;
                var smartShopperSearchParams = $scope.findCareDetails.searchParams;
                smartShopperSearchParams.acceptedSmartShopperTerms = $rootScope.smartShopperTermsAccepted;
                TransparencyFactory.setSmartShopperFilter(false);
                $scope.gotoNavigatedPage($scope.smartShopperDetails.url, $scope.smartShopperDetails.searchTerm, $scope.findCareDetails.searchParams, false);
              };
            }
          ]
        };
      }
    ]);
}());
