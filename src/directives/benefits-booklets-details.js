/**
 * Directive for bottons that load documents.
 *
 * @namespace Directives
 * @class documentButtons
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.benefitsBookletsDetails', [])
  .directive('benefitsBookletsDetails', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/benefits-booklets-details.html',
        scope: {
          /**
          * The buttons to display.
          *
          * @memberof documentButtons
          * @member {Array} buttons
          */
          benefitBooklets: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'TransparencyFactory',
          'geoLocationService',
          '$timeout',
          'analyticConstants',
          function($scope, $rootScope, TransparencyFactory, geoLocationService, $timeout, analyticConstants) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
            $scope.trackAction = $rootScope.trackAction;
            $scope.analyticConstants = analyticConstants;

            $scope.navigatePageRequested = function (url, searchTerm) {

              if (!$rootScope.selectedPlan.active){
                $rootScope.gotoView('/fad-auth/find-doctor');
              } else {
                $scope.urltoNavigate = url;
                $scope.searchTermPassed = searchTerm;
                  if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && $rootScope.noMatchPlanFound){
                    return $rootScope.gotoView('/find-care');
                  } else if (TransparencyFactory.getCity() && TransparencyFactory.getCity().zip && !$rootScope.noMatchPlanFound) {
                    $scope.gotoBrowseLevelPage(url, searchTerm);
                  } else {
                    TransparencyFactory.setZipRangeNC($scope.benefitBooklets.geoLocationDetails.distanceDetails.NCZipMin,$scope.benefitBooklets.geoLocationDetails.distanceDetails.NCZipMax);
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
                              $rootScope.city.cityFullName = $scope.benefitBooklets.geoLocationDetails.distanceDetails.currentLocation;
                              if ($rootScope.noMatchPlanFound){
                                $rootScope.gotoView('/find-care');
                               } else {
                                 $scope.gotoBrowseLevelPage(url, searchTerm);
                               }
                            } else if (response === 'position not found') {
                              TransparencyFactory.setLocationBlocked(true);
                              TransparencyFactory.setGeoLocationStatus(false);
                              TransparencyFactory.setLocationMsg($scope.benefitBooklets.geoLocationDetails.locationMsg);
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
                      TransparencyFactory.setLocationMsg($scope.benefitBooklets.geoLocationDetails.locationMsg);
                      $scope.modalObj.values.NCZipCheck = $rootScope.selectedPlan.isNorthCarolinaPlan;
                      $scope.openModal();
                    }
                  }
                }
              };

            /**
             * Based on the user selection, go to the url with planName, zipCode, distance and search term
             *
             * @memberof benefitsBookletsDetails
             * @method gotoBrowseLevelPage
             */
            $scope.gotoBrowseLevelPage = function(url, searchTerm) {
              $rootScope.city = (!$rootScope.city) ? $rootScope.newCity : $rootScope.city;
                TransparencyFactory.setSearchTerm(searchTerm);
                $rootScope.gotoView(url + '?searchTerm='+ searchTerm + '&planName='+ $rootScope.selectedPlan.lobDesc + '&zipCode=' + TransparencyFactory.getCity().zip + '&distance=' + TransparencyFactory.getDistance() + '&planId=' + $rootScope.selectedPlan.id);
           };// end of gotoBrowseLevelPage function


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
             locationMsg: $scope.benefitBooklets.geoLocationDetails.locationMsg,
             cancelButton: {
               title: $scope.loc.CANCEL
             },
             confirmButton: {
               title: $scope.loc.CONTINUE
             },
             values: {
               distanceDetails: $scope.benefitBooklets.geoLocationDetails.distanceDetails,
               distance : (TransparencyFactory.getDistance()) ? TransparencyFactory.getDistance().toString() : $scope.benefitBooklets.geoLocationDetails.distanceDetails.distance.toString(),
               city: TransparencyFactory.getCity(),
             }
           };
          }
        ]
      };
    }
  ]);
}());
