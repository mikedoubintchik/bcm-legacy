/**
 * Directive for the findDoctor.
 *
 * @namespace Directives
 * @class findDoctor
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.findDoctor', [
    'blueconnect.mobile.directives.navbar'
  ])
    .directive('findDoctor', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'partials/find-doctor.html',
          scope: {
            findDoctorDetails: '=',
            plans: '='
          },
          controller: [
            '$scope',
            '$rootScope',
            '$timeout',
            'TransparencyFactory',
            'geoLocationService',
            'adobeService',
            'analyticConstants',
            '$window',
            function ($scope, $rootScope, $timeout, TransparencyFactory, geoLocationService, adobeService, analyticConstants, $window) {
              $rootScope.vitalsError = $scope.findDoctorDetails.vitalsError ? $scope.findDoctorDetails.vitalsError : false;
              if ($scope.findDoctorDetails.vitalsError) {
                $rootScope.vitalsDown = true;
                $window.history.back();
              }

              if ($rootScope.loggedIn) {
                $rootScope.getLocale();
              } else {
                $rootScope.getInternalLocale();
              }

              if ($rootScope.loggedIn && $rootScope.menuIsOpen()) {
                $rootScope.toggleMenuOpen();
              }

              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;
              $scope.loggedIn = $rootScope.loggedIn || false;

              // if logged in, plans will actually be plan
              if ($scope.loggedIn === true) {
                $rootScope.selectedPolicy = Object.assign($rootScope.selectedPolicy, $scope.plans);
                $rootScope.selectedPlan = $scope.plans;
                gotoPlanDetails($rootScope.selectedPolicy);
              }

              $scope.togglePlan = function () {
                if ($scope.expandedQuestion) {
                  $scope.expandedQuestion = false;
                }
                $scope.expandedPlan = !$scope.expandedPlan;
                $rootScope.healthNavTrackToggleActions('select network', 'list', $scope.expandedPlan);
              };

              $scope.toggleQuestion = function () {
                if ($scope.expandedPlan) {
                  $scope.expandedPlan = false;
                }
                $scope.expandedQuestion = !$scope.expandedQuestion;
              };

              /**
               * Based on the plan name it will redirect to the find doctor search page
               *
               * @memberof findDoctor
               * @method gotoPlanDetails
               */
              $scope.gotoPlanDetails = gotoPlanDetails;

              function gotoPlanDetails(plan) {
                $rootScope.selectedPlan = (!$rootScope.noMatchPlanName) ? plan : null;
                TransparencyFactory.setSelectedPlan(plan);
                TransparencyFactory.setZipRangeNC($scope.findDoctorDetails.distanceDetails.NCZipMin,$scope.findDoctorDetails.distanceDetails.NCZipMax );

                if (!plan.name) {
                  plan.name = plan.lobDesc;
                }

                if ($rootScope.loggedIn) {
                   adobeService.trackAction('provider search: guided search', analyticConstants.HEALTHNAV_SECTION);
                } else {
                  adobeService.trackAction('provider search: select network: ' + plan.name, analyticConstants.HEALTHNAV_SECTION);
                }

                if ($rootScope.noMatchPlanFound && TransparencyFactory.getCity() && TransparencyFactory.getCity().zip) {
                  $rootScope.openFindCare = true;
                  return $rootScope.gotoView('/find-care');
                } else if ((plan.name.toLowerCase() == 'medicare supplement') || (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip)) {
                  $rootScope.gotoView('/find-doctor-search');
                } else {

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
                          $rootScope.distance = 25; // TODO default value, figure out how this really should be set
                          $rootScope.vitalsGeoCoords = response.data.geo;
                          TransparencyFactory.setDistance($rootScope.distance);
                          TransparencyFactory.setCity($rootScope.city);
                          TransparencyFactory.setCurrentLocationZipCode(response.data.zip);
                          TransparencyFactory.setGeoLocationStatus(true);
                          TransparencyFactory.setLocationBlocked(false);
                          if ($rootScope.noMatchPlanFound) {
                            $rootScope.openFindCare = true;
                            return $rootScope.gotoView('/find-care');
                          } else {
                            $scope.gotoView('/find-doctor-search');
                          }
                        } else if (response === 'position not found') {
                          // this is when I block current location
                          TransparencyFactory.setLocationBlocked(true);
                          TransparencyFactory.setGeoLocationStatus(false);
                          TransparencyFactory.setLocationMsg($scope.findDoctorDetails.locationMsg);
                          $scope.modalObj.values.NCZipCheck = plan.isNorthCarolinaPlan;
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
                    TransparencyFactory.setLocationMsg($scope.findDoctorDetails.locationMsg);
                    $scope.modalObj.values.NCZipCheck = plan.isNorthCarolinaPlan;
                    $scope.openModal();
                  }
                }
              }

              $scope.confirmFunc = function(data) {
                $rootScope.distance = data.distance;
                $rootScope.city = data.city;
                TransparencyFactory.setDistance($rootScope.distance);
                TransparencyFactory.setCity($rootScope.city);
                TransparencyFactory.setGeoLocationStatus(false);
                if ($rootScope.noMatchPlanFound){
                  $rootScope.openFindCare = true;
                  $rootScope.gotoView('/find-care');
                } else {
                  $rootScope.gotoView('/find-doctor-search');
                }
              };

              $scope.modalObj = {
                locationMsg: $scope.findDoctorDetails.locationMsg,
                cancelButton: {
                  title: $scope.loc.CANCEL
                },
                confirmButton: {
                  title: $scope.loc.CONTINUE
                },
                values: {
                  distanceDetails: $scope.findDoctorDetails.distanceDetails,
                  distance : (TransparencyFactory.getDistance()) ? TransparencyFactory.getDistance().toString() : $scope.findDoctorDetails.distanceDetails.distance.toString(),
                  city: TransparencyFactory.getCity()
                }
              };

              $scope.alertModalObj = {
                title: $scope.findDoctorDetails.title ? $scope.findDoctorDetails.title : '',
                message: $scope.findDoctorDetails.message ? $scope.findDoctorDetails.message : '',
                confirmBtn: $scope.findDoctorDetails.confirmBtn ? $scope.findDoctorDetails.confirmBtn : '',
              };
            }]
        };
      }
    ]);
}());
