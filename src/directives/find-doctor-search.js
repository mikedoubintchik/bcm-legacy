/**
 * Directive for the findDoctorSearch.
 *
 * @namespace Directives
 * @class findDoctorSearch
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.findDoctorSearch', [])
    .directive('findDoctorSearch', ['$http', 'config',
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/find-doctor-search.html',
          scope: {
            findDoctorSearchDetails: '=',
            smartShopperDetails: '=',
          },
          controller: [
            '$scope',
            '$rootScope',
            '$http',
            '$anchorScroll',
            'languageService',
            'TransparencyFactory',
            'config',
            'geoLocationService',
            'helpService',
            '$timeout',
            'analyticConstants',
            function($scope, $rootScope, $http, $anchorScroll, languageService, TransparencyFactory, config, geoLocationService, helpService, $timeout, analyticConstants) {
              $rootScope.openMapView = false;
              $scope.isSmartShopperEligible = ($rootScope.loggedIn && $rootScope.isSmartShopperEligible);
              $scope.language = $rootScope.language || 'en';
              $scope.bdcLink = $scope.findDoctorSearchDetails.bdcLink;
              languageService.getLocale($scope.language).then(function(localeReturned) {
                $scope.loc = localeReturned;
              }).catch(console.warn);
              $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
              $scope.$on('validate input', function() {
                $timeout(function() {
                  $scope.validateCityInput();
                });
              });

              $scope.detectClickElement = function(event) {
                if (event.target.id !== 'city-input' && $scope.isZipDirty) {
                  $('#_cities').addClass("hidden");
                  $scope.validateCityInput();
                }
              };

              $scope.$watch('data.city.zip', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                  $scope.isZipDirty = true;
                }
              });

              //for medicare supplement and blue medicare pdp plan hide search settings box on new search page.
              $scope.hideSearchSettings = ($scope.findDoctorSearchDetails.blockSearchBoxForRxPdpPlan || $scope.findDoctorSearchDetails.message) ? true : false;

              $scope.gotoView = $rootScope.gotoView;
              $scope.loc = $rootScope.loc;
              $scope.expandDiv = false;
              $scope.showCommonSearch = false;
              $scope.currentLocation = TransparencyFactory.getGeoLocationStatus();
              $scope.selectedPlan = TransparencyFactory.getSelectedPlan();
              $scope.currentLocationActive = ($rootScope.toggleIcon === false) ? $rootScope.toggleIcon : $scope.currentLocation;

              TransparencyFactory.setLocationMsg($scope.findDoctorSearchDetails.locationMsg);
              $scope.nomatchPlan = $rootScope.noMatchPlanFound;

              $scope.planName = ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $scope.selectedPlan.lobDesc : $scope.selectedPlan.name;

              $scope.locationMsg = TransparencyFactory.getLocationMsg();
              $scope.locationBlocked = TransparencyFactory.getLocationBlocked();
              $scope.loggedIn = $rootScope.loggedIn;
              $scope.medicareUser = ($rootScope.loggedIn && $rootScope.selectedPolicy.sourceSystem === 'Amisys') ? true : false;
              $scope.errorText = '';
              $scope.isZipValid = true;
              $scope.isZipDirty = false;
              $scope.highlightTextSpecialists = false;
              $scope.highlightTextProcedures = false;
              $scope.displayDistance = TransparencyFactory.getDistance();
              $scope.data = {
                displayDistance: null,
                city: TransparencyFactory.getCity(),
              };

              $scope.typeaheadInProgress = false;
              $scope.queryHasFocus = false;

              // get members of current policy for members dropdown list
              $scope.policyMembersList = TransparencyFactory.getCurrentPolicyMembers();
              // set initial selectedMember if user is logged in
              if ($rootScope.isLoggedIn) {
                TransparencyFactory.setSelectedMember($scope.policyMembersList[$rootScope.indexOfSelectedMember]);
              }

              //reinitialize all the search terms each time a new search is performed
              TransparencyFactory.resetSearchTerms();

              $rootScope.healthNavTrackStates(0, { title: $scope.findDoctorSearchDetails.message ? 'select network: ' + $scope.planName : analyticConstants.HOME_SECTION });
              // Validate Zip Code when toggle plan
              $scope.onloadZipCodeValidation = function() {
                if ($scope.hideSearchSettings){
                  if (!$scope.locationBlocked && $rootScope.city) {
                    $scope.validateNCZipCode($rootScope.city.zip);
                  } else if (!$scope.locationBlocked && !$rootScope.city) {
                    $rootScope.city = $rootScope.newCity;
                    $scope.validateNCZipCode($rootScope.newCity.zip);
                  } else {
                    $scope.validateNCZipCode($scope.data.city.zip);
                  }
                }
              };

              // Enable Zip Code input and turn of current location
              $scope.enableInputZipCode = function() {
                if ($scope.currentLocationActive === true) {
                  $scope.data.city = { cityFullName: '' };
                  $scope.currentLocationActive = false;
                  $rootScope.toggleIcon = false;
                }
              };

              // NC Zip Code validation for plan toggling and current location toggling
              $scope.validateNCZipCode = function(zipCode, useCurrentLocation) {
                const resp = TransparencyFactory.validateZipCode(zipCode);
                if (!resp.status) {
                  $scope.isZipDirty = true;
                  $scope.isZipValid = false;
                  $scope.errorText = resp.message;
                  $scope.expandDiv = true;
                } else {
                  $scope.isZipValid = true;
                  $scope.isZipDirty = false;
                  $scope.errorText = '';
                  $scope.expandDiv = useCurrentLocation ? true : false;
                }
              };

              $scope.clearQueryAndTypeaheadResults = function() {
                this.query = '';
                $scope.typeaheadResults = null;
                $scope.typeaheadError = false;
                $scope.showCommonSearch = true;
                $scope.highlightTextSpecialists = false;
                $scope.highlightTextProcedures = false;
                $scope.queryHasFocus = true;
                $scope.expandProceduresDiv = false;
                $scope.expandSpecialtiesDiv = false;
                angular.element('.form-control').focus();
              };

              if ($scope.findDoctorSearchDetails.searchParams.distance && $scope.findDoctorSearchDetails.searchParams.zipCode) {
                $scope.data.city.cityFullName = $scope.currentLocationActive === true ? $scope.findDoctorSearchDetails.distanceDetails.currentLocation : TransparencyFactory.getCity() ? TransparencyFactory.getCity().cityFullName : $scope.findDoctorSearchDetails.distanceDetails.city.cityFullName;

              } else if ($scope.data.city) {
                  $scope.data.city.cityFullName = TransparencyFactory.getCity() ? TransparencyFactory.getCity().cityFullName : $scope.findDoctorSearchDetails.distanceDetails.city.cityFullName;
              }
              $scope.data.displayDistance = ($scope.displayDistance) ? $scope.displayDistance.toString() : $scope.findDoctorSearchDetails.distanceDetails.defaultDistance;

              if ($scope.policyMembersList) {
                $scope.selectedMember = (!$rootScope.indexOfSelectedMember) ? $scope.policyMembersList[0] : $scope.policyMembersList[$rootScope.indexOfSelectedMember];
              }

              $scope.selectPolicyMember = function(selectedMember) {
                $rootScope.indexOfSelectedMember = $scope.policyMembersList.indexOf(selectedMember);
                TransparencyFactory.setSelectedMember($scope.policyMembersList[$rootScope.indexOfSelectedMember]);
              };

              /**
               * Based on the user selects the search settings it will expand or collapse the div
               *
               * @memberof findDoctorSearch
               * @method expandSettings
               */
              $scope.expandSettings = function() {
                $scope.expandDiv = !$scope.expandDiv;
              };

              $scope.hideTypeAhead = function() {
                $scope.showTypeAhead = false;
                $scope.showCommonSearch = false;
                $scope.highlightTextSpecialists = false;
                $scope.highlightTextProcedures = false;
              };

              $scope.toggleQueryHasFocus = function(booleanVal) {
                $scope.queryHasFocus = booleanVal;
                $scope.expandCommonDiv = false;
              };

              $scope.displayFlyout = function(query) {
                // reset scroll to top and highlight to false
                angular.element(".type-ahead-results-container")[0].scrollTop = 0;
                $scope.highlightTextSpecialists = false;
                $scope.highlightTextProcedures = false;
                if (!query) {
                  $scope.showTypeAhead = false;
                  $scope.showCommonSearch = true;
                  $scope.typeaheadError = false;
                  $scope.highlightTextSpecialists = false;
                  $scope.highlightTextProcedures = false;
                  $scope.queryHasFocus = true;
                  return;
                }

                $scope.typeaheadInProgress = true;
                $scope.showTypeAhead = true;
                $scope.showCommonSearch = false;
                var endPoint = ($scope.loggedIn && !$rootScope.noMatchPlanFound) ? 'procedures?locale=en_us&search_term=' : '?locale=en_us&search_term=';
                endPoint = endPoint + query + '&member_number=' + $scope.selectedPlan.alphaPrefix + $scope.selectedPlan.externalId + '&network_id=' + $scope.selectedPlan.id +
                  (
                    $scope.selectedPlan.policyMembers ?
                      '&dob=' + $scope.selectedPlan.policyMembers[0].birthDate.slice(0, 10) :
                      ''
                  );
                if ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) {
                  $http.post(config.typeaheadUrl + endPoint,
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
                      $rootScope.healthNavTrackStates(3, { searchTerm: query });
                    }
                  })
                    .catch(function() {
                      $scope.typeaheadError = true;
                      $scope.typeaheadInProgress = false;
                    });
                } else {
                  $http.get(config.typeaheadUrl + endPoint + '&geo_location=' + (($rootScope.toggleOnOff) ? TransparencyFactory.getCurrentLocationZipCode() : TransparencyFactory.getCity().zip)).then(function(result) {
                    $scope.typeaheadInProgress = false;
                    $scope.typeaheadResults = result.data;
                    $scope.typeaheadError = false;
                    if (result.data &&
                      !result.data.procedures.length &&
                      !result.data.providers.length &&
                      !result.data.search_specialties.length) {
                      $rootScope.healthNavTrackStates(3, { searchTerm: query });
                    }
                  })
                    .catch(function() {
                      $scope.typeaheadError = true;
                      $scope.typeaheadInProgress = false;
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
                return $scope.findDoctorSearchDetails.commonSearchTerms ? $scope.findDoctorSearchDetails.commonSearchTerms.commonSearchTerms.length > 3 : false;
              };

              $scope.anyCommonTerms = function() {
                return $scope.findDoctorSearchDetails.commonSearchTerms ? $scope.findDoctorSearchDetails.commonSearchTerms.commonSearchTerms.length > 0 : false;
              };

              $scope.goToCommonDetails = function(commonTerm) {
                if (!$scope.isZipValid) {
                  return;
                }
                TransparencyFactory.setResultsTerm(commonTerm.commonSearchTerm);
                $rootScope.gotoView(commonTerm.browsePath);
              };

              $scope.goToDetails = function(result) {
                if (!$scope.isZipValid) {
                  return;
                }
                TransparencyFactory.setSearchSpecialtyId(null);
                if (result.id && !result.provider_id) {
                  TransparencyFactory.setSearchTerm(result.name);
                  TransparencyFactory.setResultsTerm(result.name);
                  $rootScope.gotoView('/find-doctor-search-results?searchTerm=' + result.name + '&id=' + result.id + '&network_id=' + $scope.selectedPlan.id + '&planName=' + $scope.selectedPlan.name);
                } else {
                  var searchTerm = result.provider_id ? result.name : result;
                  TransparencyFactory.setSearchTerm(searchTerm);
                  TransparencyFactory.setResultsTerm(searchTerm);
                  $rootScope.gotoView('/find-doctor-search-results?name=' + searchTerm + '&network_id=' + $scope.selectedPlan.id + '&planName=' + $scope.selectedPlan.name);
                }
              };

              /**
               * Based on the user selection, go to the url with planName, zipCode, distance and search term
               *
               * @memberof findDoctorSearch
               * @method gotoBrowseLevelPage
               */
              $scope.gotoBrowseLevelPage = function(url, searchTerm, planDetails, isExternalLink) {
                // External link?
                if (isExternalLink) {
                  return $rootScope.openInBrowser(url);
                }

                // Prevent forwarding if Zip Code is invalid
                if (!$scope.isZipValid) {
                  return;
                }

                $rootScope.healthNavTrackActions(4, { searchTerm: searchTerm }, analyticConstants.HOME_SECTION);

                if (searchTerm === $scope.loc.URGENT_CARE_HOME) { // if the selection in the browse level one have id go to reults page
                  TransparencyFactory.setResultsTerm(searchTerm);
                  TransparencyFactory.setSearchSpecialtyId($scope.findDoctorSearchDetails.urgentCareDetails[0].id);
                  $rootScope.gotoView('/find-doctor-search-results?id=' + TransparencyFactory.getSearchSpecialtyId() + '&network_id=' + $rootScope.selectedPlan.id + '&distance=' + planDetails.distance + '&searchTerm=' + searchTerm);
                } else {
                  TransparencyFactory.setSearchTerm(searchTerm);
                  $rootScope.gotoView(url + '?searchTerm=' + searchTerm + '&planName=' + $scope.planName + '&zipCode=' + TransparencyFactory.getCity().zip + '&distance=' + TransparencyFactory.getDistance() + '&planId=' + $rootScope.selectedPlan.id + '&smartShopperFlow=' + planDetails.acceptedSmartShopperTerms);
                }
              };

              /**
               * Toggle Current location
               *
               * @memberof findDoctorSearch
               * @method toggleCurrentLocation
               */
              $scope.toggleCurrentLocation = function() {
                $scope.currentLocationActive = !$scope.currentLocationActive;
                $rootScope.toggleOnOff = $scope.currentLocationActive;
                $rootScope.toggleIcon = $scope.currentLocationActive;
                if ($scope.currentLocation && $scope.currentLocationActive) {
                  $scope.data.city = $rootScope.currentCity;
                  $scope.validateNCZipCode($rootScope.city.zip, true);
                  TransparencyFactory.setGeoLocationStatus(true);
                  TransparencyFactory.setCity($scope.data.city);
                } else if (!$scope.currentLocation && $scope.currentLocationActive) {
                  if (navigator.geolocation) {
                    $timeout(function() {
                      $rootScope.enableLocation = true;
                    }, 300);
                    $rootScope.$emit('pageLoading');
                    geoLocationService.getLocation().then(function(response) {
                      $rootScope.$emit('pageLoaded');
                      if (response.data && response.data.zip) {
                        $rootScope.city = response.data;
                        $rootScope.city.cityFullName = $rootScope.city.city + $rootScope.city.state_code + ' - ' + $rootScope.city.zip;
                        $rootScope.currentCity = $rootScope.city;
                        $rootScope.vitalsGeoCoords = response.data.geo;
                        TransparencyFactory.setCity(response.data);
                        TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                        TransparencyFactory.setGeoLocationStatus(true);
                        $scope.currentLocation = TransparencyFactory.getGeoLocationStatus();
                        TransparencyFactory.setLocationBlocked(false);
                        $scope.data.city = response.data;
                        $scope.data.city.cityFullName = $scope.findDoctorSearchDetails.distanceDetails.currentLocation;
                        $scope.validateNCZipCode($rootScope.city.zip);
                        if ($scope.isZipValid) {
                          $rootScope.city = $scope.data.city;
                          $rootScope.currentCity = $rootScope.city;
                          TransparencyFactory.setCity($scope.data.city);
                        }
                      } else {
                        $scope.currentLocationFailed();
                      }
                    })
                      .catch(function() {
                        $rootScope.$emit('pageLoaded');
                        $scope.currentLocationFailed();
                      });
                  } else {
                    $rootScope.$emit('pageLoaded');
                    TransparencyFactory.setLocationBlocked(true);
                    $scope.currentLocationFailed();
                  }
                } else {
                  $scope.data.city = { cityFullName: '' };
                }
              };

              /**
              * if finding current location fails
              *
              * @memberof findDoctorSearch
              * @method currentLocationFailed
              */

              $scope.currentLocationFailed = function() {
                $scope.isZipDirty = true;
                $scope.isZipValid = false;
                $scope.errorText = $rootScope.loc.ERROR_ENTER_CITY_COUNTY_OR_ZIP_CODE;
                $scope.data.city = { cityFullName: '' };
              };

              $scope.validateCityInput = function() {
                const resp = TransparencyFactory.validateCity(
                  $scope.data.city
                );

                if (resp.status === true) {
                  $rootScope.city = $scope.data.city;
                  TransparencyFactory.setCity($scope.data.city);
                }

                // Set error message.
                $scope.isZipValid = resp.status;
                $scope.errorText = resp.message;
              };

              $scope.saveDistance = function() {
                TransparencyFactory.setDistance($scope.data.displayDistance);
              };

              $scope.launchRefineSearch = function(query) {
                if (!$scope.typeaheadInProgress && !$scope.typeaheadError && query
                  && ($scope.typeaheadResults._meta.counts.total.providers !== 0
                    || $scope.typeaheadResults._meta.counts.total.search_specialties !== 0
                    || $scope.typeaheadResults._meta.counts.total.procedures !== 0)) {
                  $scope.modalObj.peoplePlacesLength = $scope.typeaheadResults.providers.length;
                  $scope.modalObj.specialistsWhoLength = $scope.typeaheadResults.search_specialties.length;
                  $scope.modalObj.providersPerformLength = $scope.typeaheadResults.procedures.length;
                  TransparencyFactory.setSearchTerm(query);
                  $scope.openModal(query);
                }
              };

              $scope.refineSearchClick = function(event, query) {
                if (event.key === 'Enter') {
                  $scope.launchRefineSearch(query);
                }
              };

              $scope.confirmModal = function(data, userAction) {
                if (userAction === 'specialistsWho') {
                  $scope.highlightTextSpecialists = true;
                  $scope.highlightTextProcedures = false;
                  $anchorScroll('search_specialties');
                } else if (userAction === 'providersPerform') {
                  $scope.highlightTextProcedures = true;
                  $scope.highlightTextSpecialists = false;
                  $anchorScroll('procedures');
                } else {
                  if (!$scope.isZipValid) {
                    return;
                  }
                  TransparencyFactory.setSearchTerm(this.query);
                  TransparencyFactory.setResultsTerm(this.query);
                  $rootScope.gotoView('/find-doctor-search-results?name=' + this.query + '&network_id=' + $scope.selectedPlan.id + '&planName=' + $scope.selectedPlan.name);
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

              if ($rootScope.loggedIn) {
                $scope.termsModalObj = $scope.smartShopperDetails.acceptTermsModal;
              }

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
                var smartShopperSearchParams = $scope.findDoctorSearchDetails.searchParams;
                smartShopperSearchParams.acceptedSmartShopperTerms = $rootScope.smartShopperTermsAccepted;
                TransparencyFactory.setSmartShopperFilter(false);
                $scope.gotoBrowseLevelPage($scope.smartShopperDetails.url, $scope.smartShopperDetails.searchTerm, $scope.findDoctorSearchDetails.searchParams, false);
              };
            }
          ]
        };
      }
    ]);
}());
