/**
 * Directive for find doctor filter
 *
 * @namespace Directives
 * @class filterDetails
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.filterDetails', [

  ])
  .directive('filterDetails', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/filter-details.html',
        scope: {
          findDoctorFilterDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'TransparencyFactory',
          'geoLocationService',
          '$timeout',
          'helpService',
          'languageService',
          function($scope, $rootScope, TransparencyFactory, geoLocationService, $timeout, helpService, languageService) {
            $scope.language = $rootScope.language || 'en';
            languageService.getLocale($scope.language).then(function(localeReturned) {
              $scope.loc = localeReturned;
            }).catch(console.warn);

            if ($rootScope.loggedIn) {
              $rootScope.showPolicySelect = false;
            }

            $scope.loc = $rootScope.loc;
            $scope.currentLocation = TransparencyFactory.getGeoLocationStatus();

            $scope.currentLocationActive = (($rootScope.city.cityFullName === 'Current Location') || ($scope.findDoctorFilterDetails.filterCityName === 'Current Location')) ? true : false;
            $scope.selectedPlan = TransparencyFactory.getSelectedPlan(); // plan details the user has selected
            $scope.selectedBrowse = TransparencyFactory.getResultsTerm(); // browse icon the user has selected in find-doctor-search page
            // set initial filter value to TransparencyFactory
            $scope.specialtyIndex = $scope.findDoctorFilterDetails.listdetails.specialistDetails.defaultOptionIndex;
            $scope.initialSpecialty = $scope.findDoctorFilterDetails.listdetails.specialistDetails.values[$scope.specialtyIndex];
            TransparencyFactory.setFilterSpecialtySelectedTerm($scope.initialSpecialty.value !== -1 ? $scope.initialSpecialty.value : '');
            $scope.tierIndex = ($scope.findDoctorFilterDetails.listdetails.tierDetails) ? $scope.findDoctorFilterDetails.listdetails.tierDetails.defaultOptionIndex : null;
            $scope.initialTier = ($scope.findDoctorFilterDetails.listdetails.tierDetails) ? $scope.findDoctorFilterDetails.listdetails.tierDetails.values[$scope.tierIndex] : null;
            TransparencyFactory.setFilterTierSelectedTerm(($scope.initialTier && $scope.initialTier.value !== -1) ? {type: $scope.initialTier.type, value: $scope.initialTier.value} : {type: '', value: ''});
            $scope.genderIndex = $scope.findDoctorFilterDetails.listdetails.gender.defaultOptionIndex;
            $scope.initialGender = $scope.findDoctorFilterDetails.listdetails.gender.values[$scope.genderIndex];
            TransparencyFactory.setFilterGenderSelectedTerm($scope.initialGender.value !== -1 ? $scope.initialGender.value : '');
            TransparencyFactory.setSearchSpecialtyId($scope.findDoctorFilterDetails.filter_specialty_id);
            TransparencyFactory.setLocationMsg($scope.findDoctorFilterDetails.locationMsg);
            $scope.locationBlocked = TransparencyFactory.getLocationBlocked();
            $scope.locationMsg = TransparencyFactory.getLocationMsg();
            $scope.selectedSmartShopperFilter = ($scope.findDoctorFilterDetails.smartShopperFlow === 'true') ? TransparencyFactory.getSmartShopperFilter() : TransparencyFactory.setSmartShopperFilter(false);

            $scope.displayDistance = $rootScope.currentRadius ? $rootScope.currentRadius : TransparencyFactory.getDistance();
            $scope.isZipDirty = false;
            $scope.isZipValid = true;

            $scope.smartShopperToggleCheckBox = function () {
              $scope.selectedSmartShopperFilter = !$scope.selectedSmartShopperFilter;
            };


            $scope.$watch('data.city.cityFullName', function(newVal, oldVal) {
              if (newVal !== oldVal) {
                $scope.isZipDirty = true;
              }
            });

            $scope.data = {
              displayDistance: null,
              city: {
                cityFullName: ''
              }
            };

            $scope.$on('validate input', function() {
              $timeout(function () {
                $scope.validateCityInput();
              });
            });

            $scope.detectClickElement = function (event) {
              if (event.target.id !== 'city-input' && $scope.isZipDirty) {
                $('#_cities').addClass("hidden");
                $scope.validateCityInput();
              }
            };

            $scope.showGlossaryTerms = function(itemName) {
              $scope.fileName = 'partials/glossary-of-terms';
              $rootScope.headerTerm = $scope.findDoctorFilterDetails.glossaryHeader;
              if (itemName === $scope.loc.SPECIALITY) {
                helpService.showHelp($scope.fileName, $scope.findDoctorFilterDetails.specialtyTerms);
              } else if (itemName === $scope.loc.TIER_DESIGNATION) {
                helpService.showHelp($scope.fileName, $scope.findDoctorFilterDetails.tierTerms);
              } else if (itemName === $scope.loc.GENDER) {
                helpService.showHelp($scope.fileName, $scope.findDoctorFilterDetails.genderTerms);
              }
            };

            if ($scope.findDoctorFilterDetails.distanceDetails.defaultDistance && $scope.findDoctorFilterDetails.distanceDetails.cityFullName) {
               $scope.data.city.cityFullName = $scope.currentLocationActive === true ? $scope.findDoctorFilterDetails.distanceDetails.currentLocation : ($scope.findDoctorFilterDetails.filterCityName ? $scope.findDoctorFilterDetails.filterCityName : ((TransparencyFactory.getCity().cityFullName) ? TransparencyFactory.getCity().cityFullName : $scope.findDoctorFilterDetails.distanceDetails.cityFullName));
            } else {
              $scope.data.city.cityFullName = $scope.filterCityName ? $scope.filterCityName : ((TransparencyFactory.getCity().cityFullName) ? TransparencyFactory.getCity().cityFullName : $scope.findDoctorFilterDetails.distanceDetails.cityFullName);
            }

            $scope.data.city = ($scope.currentLocationActive) ?
              $rootScope.currentCity : $scope.findDoctorFilterDetails.filterCityName ?
              {
                cityFullName: $scope.findDoctorFilterDetails.filterCityName
              }
              : $rootScope.searchAreaNearestCity ?
              $rootScope.searchAreaNearestCity
              : TransparencyFactory.getCity();
            
            $scope.data.city = ($rootScope.city) ? $rootScope.city : $scope.data.city;

            $scope.data.displayDistance = $scope.findDoctorFilterDetails.filterDistance ? $scope.findDoctorFilterDetails.filterDistance.toString() : (($scope.displayDistance) ? $scope.displayDistance.toString() : $scope.findDoctorFilterDetails.distanceDetails.defaultDistance);

            /**
             * Validate city
             *
             * @memberof filterDetails
             * @method validateCityInput
             */
            $scope.validateCityInput = function () {
              if (!$scope.currentLocationActive) {
                const resp = TransparencyFactory.validateCity($scope.data.city);
                if (resp.status) {
                  TransparencyFactory.setFilterCityName($scope.data.city.cityFullName);
                }
                $scope.isZipValid = resp.status;
                $scope.errorText = resp.message;
              }
            };

            /**
             * Toggle Current location
             *
             * @memberof filterDetails
             * @method toggleCurrentLocation
             */
            $scope.toggleCurrentLocation = function () {
              $scope.currentLocationActive = !$scope.currentLocationActive;
              $rootScope.toggleOnOff = $scope.currentLocationActive;
              $rootScope.toggleIcon = $scope.currentLocationActive;
              if ($scope.currentLocation && $scope.currentLocationActive){
                $scope.data.city = $rootScope.currentCity;
                $scope.isZipDirty = false;
                $scope.isZipValid = true;
                $scope.errorText = '';
                $scope.validateCityInput();
                if ($scope.isZipValid) {
                  TransparencyFactory.setCity($scope.data.city);
                }
              } else if (!$scope.currentLocation && $scope.currentLocationActive) {
                if (navigator.geolocation) {
                  $timeout( function(){
                    $rootScope.enableLocation = true;
                  }, 300 );
                  $rootScope.$emit('pageLoading');
                  geoLocationService.getLocation().then(function(response){
                    $rootScope.$emit('pageLoaded');
                    if (response.data && response.data.zip) {
                      $scope.data.city = response.data;
                      $scope.isZipValid = true;
                      $scope.isZipDirty = false;
                      $scope.errorText = '';
                      TransparencyFactory.setGeoLocationStatus(true);
                      TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                      TransparencyFactory.setLocationBlocked(false);
                      $rootScope.vitalsGeoCoords = response.data.geo;
                      $scope.data.city.cityFullName = $scope.findDoctorFilterDetails.distanceDetails.currentLocation;
                      $scope.currentLocation = TransparencyFactory.getGeoLocationStatus();
                      $scope.validateCityInput();
                        if ($scope.isZipValid) {
                          $rootScope.city = $scope.data.city;
                          $rootScope.currentCity = $rootScope.city;
                          TransparencyFactory.setCity($scope.data.city);
                        }
                      } else {
                        $scope.currentLocationFailed();
                      }
                  })
                  .catch(function (error) {
                    $rootScope.$emit('pageLoaded');
                    $scope.currentLocationFailed();
                  });
                } else {
                  $rootScope.$emit('pageLoaded');
                  TransparencyFactory.setLocationBlocked(true);
                  $scope.currentLocationFailed();
                }
              } else {
                $scope.data.city = {cityFullName: ''};
              }
            };

            /**
            * if finding current location fails
            *
            * @memberof filterDetails
            * @method currentLocationFailed
            */

            $scope.currentLocationFailed = function() {
              $scope.isZipDirty = true;
              $scope.isZipValid = false;
              $scope.currentLocationActive = false;
              $scope.errorText = $rootScope.loc.ERROR_ENTER_CITY_COUNTY_OR_ZIP_CODE;
              $scope.data.city = {cityFullName: ''};
            };

            $scope.saveDistance = function() {
              TransparencyFactory.setFilterDistance($scope.data.displayDistance);
            };

            $scope.selectedFilterValue = function(selectedItem, item) {
              if (item.name === $scope.loc.TIER_DESIGNATION) {
                TransparencyFactory.setFilterTierSelectedTerm(selectedItem.value !== -1 ? {type: selectedItem.type, value: selectedItem.value} : {type: '', value: ''});
              } else if (item.name === $scope.loc.SPECIALITY) {
                TransparencyFactory.setFilterSpecialtySelectedTerm(selectedItem.value !== -1 ? selectedItem.value : '');
              } else if (item.name === $scope.loc.GENDER) {
                TransparencyFactory.setFilterGenderSelectedTerm(selectedItem.value !== -1 ? selectedItem.value : '');
              }
            };

            // Enable Zip Code input and turn of current location
            $scope.enableInputZipCode = function() {
              if ($scope.currentLocationActive === true) {
                  $scope.data.city = {cityFullName: ''};
                  $scope.currentLocationActive = false;
                  $scope.isZipValid = false;
                  $rootScope.toggleIcon = false;
              }
            };

            $scope.filterResults = function() {
              if (!$scope.isZipValid) {
                return;
              }

              //smart shopper check box selected set as true
              TransparencyFactory.setSmartShopperFilter($scope.selectedSmartShopperFilter);

              // not map search && data.city is updated
              if (!$scope.findDoctorFilterDetails.latlon && $scope.data.city.zip) {
                $rootScope.city = $scope.data.city;
                TransparencyFactory.setCity($scope.data.city);
              }

              var zipCode = $scope.data.city.cityFullName === $scope.findDoctorFilterDetails.distanceDetails.currentLocation ? $rootScope.currentCity.zip : $scope.data.city.zip ? $scope.data.city.zip : $scope.findDoctorFilterDetails.filterZipCode;

              $scope.filtersData = {
                tierData: {
                  type: TransparencyFactory.getFilterTierSelectedTerm().type || '',
                  value: TransparencyFactory.getFilterTierSelectedTerm().value || ''
                },
                specialty: TransparencyFactory.getFilterSpecialtySelectedTerm() || '',
                gender: TransparencyFactory.getFilterGenderSelectedTerm() || '',
                smartShopperRewardsFilter: TransparencyFactory.getSmartShopperFilter() || ''
              };

              TransparencyFactory.setFiltersData($scope.filtersData);
              $rootScope.filtersDataArr.unshift(TransparencyFactory.getFiltersData());

              $rootScope.currentRadius = $scope.data.displayDistance;
              var latlon = $scope.isZipDirty ? '' : typeof $scope.findDoctorFilterDetails.latlon === 'string' ? $scope.findDoctorFilterDetails.latlon.replace(/,/g, '%2C') : '';

              var cityFullName = $scope.data.city.cityFullName;

              if (TransparencyFactory.getSearchSpecialtyId()) {
                $rootScope.gotoView('/find-doctor-search-results?distance=' + $scope.data.displayDistance + '&latlon=' + latlon + '&cityFullName=' + cityFullName + '&zipCode=' + zipCode + '&searchTerm='+ $scope.selectedBrowse + '&planName='+ $scope.selectedPlan.name + '&network_id=' + $scope.selectedPlan.id + '&filters=' + true + '&id=' + TransparencyFactory.getSearchSpecialtyId() + '&smartShopperFlow=' + $scope.findDoctorFilterDetails.smartShopperFlow + '&isPcpFlow=' + $scope.findDoctorFilterDetails.isPcpFlow);
              } else {
                $rootScope.gotoView('/find-doctor-search-results?distance=' + $scope.data.displayDistance + '&latlon=' + latlon + '&cityFullName=' + cityFullName + '&zipCode=' + zipCode + '&name=' + $scope.selectedBrowse + '&network_id=' + $scope.selectedPlan.id + '&filters=' + true + '&planName=' + $scope.selectedPlan.name + '&smartShopperFlow=' + $scope.findDoctorFilterDetails.smartShopperFlow + '&isPcpFlow=' + $scope.findDoctorFilterDetails.isPcpFlow);
              }
            };

          }
        ]
      };
    }
  ]);
}());
