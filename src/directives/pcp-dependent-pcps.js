/**
 * Directive for the pcp dependent pcp card.
 *
 * @namespace Directives
 * @class pcpDependentPcps
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.pcpDependentPcps', [])
    .directive('pcpDependentPcps', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/pcp-dependent-pcps.html',
          scope: {
            /**
             * Display information for the dependent pcp.
             *
             * @memberof about
             * @member {Object} dependentPcpDetails
             */
            dependentPcpDetails: '=',
          },
          controller: [
            '$rootScope',
            '$scope',
            '$filter',
            'TransparencyFactory',
            'geoLocationService',
            '$timeout',
            'helpService',
            'findDoctorService',
            function(
              $rootScope,
              $scope,
              $filter,
              TransparencyFactory,
              geoLocationService,
              $timeout,
              helpService,
              findDoctorService
            ) {
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.loc = $rootScope.loc;
              $scope.policy = $rootScope.selectedPolicy;
              $scope.detailsPage = null;
              $scope.policyMembersList = TransparencyFactory.getCurrentPolicyMembers();

              $scope.toggleCollapse = function(index) {
                var cardClose = 'cardClose' + index;
                $scope[cardClose] = !$scope[cardClose];
              };

              $scope.otherPcpSearch = function(searchInput) {
                if (
                  TransparencyFactory.getCity() &&
                  TransparencyFactory.getCity().zip
                ) {
                  $scope.gotoPrimaryCarePage(searchInput);
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
                          $rootScope.city.cityFullName =
                            $rootScope.city.city +
                            $rootScope.city.state_code +
                            ' - ' +
                            $rootScope.city.zip;
                          $rootScope.currentCity = $rootScope.city;
                          $rootScope.vitalsGeoCoords = response.data.geo;
                          $rootScope.distance = 25; // TODO default value, figure out how this really should be set
                          TransparencyFactory.setDistance($rootScope.distance);
                          TransparencyFactory.setCity($rootScope.city);
                          TransparencyFactory.setGeoLocationStatus(true);
                          TransparencyFactory.setCurrentLocationZipCode(
                            response.data.zip
                          );
                          TransparencyFactory.setLocationBlocked(false);
                          $rootScope.city.cityFullName =
                            $scope.dependentPcpDetails.geoLocationDetails.distanceDetails.currentLocation;
                          $scope.gotoPrimaryCarePage(searchInput);
                        } else if (response === 'position not found') {
                          TransparencyFactory.setLocationBlocked(true);
                          TransparencyFactory.setGeoLocationStatus(false);
                          TransparencyFactory.setLocationMsg(
                            $scope.dependentPcpDetails.geoLocationDetails.locationMsg
                          );
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
                    TransparencyFactory.setLocationMsg(
                      $scope.dependentPcpDetails.geoLocationDetails.locationMsg
                    );
                    $scope.modalObj.values.NCZipCheck =
                      $rootScope.selectedPlan.isNorthCarolinaPlan;
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
                $scope.gotoPrimaryCarePage($scope.dependentPcpDetails.searchInput);
              };

              if ($scope.dependentPcpDetails.geoLocationDetails) {
                $scope.modalObj = {
                  locationMsg: $scope.dependentPcpDetails.geoLocationDetails.locationMsg,
                  pcp: true,
                  cancelButton: {
                    title: $scope.loc.CANCEL,
                  },
                  confirmButton: {
                    title: $scope.loc.CONTINUE,
                  },
                  values: {
                    distanceDetails:
                      $scope.dependentPcpDetails.geoLocationDetails.distanceDetails,
                    distance: TransparencyFactory.getDistance()
                      ? TransparencyFactory.getDistance().toString()
                      : $scope.dependentPcpDetails.geoLocationDetails.distanceDetails.distance.toString(),
                    city: TransparencyFactory.getCity(),
                  },
                };
              }

              $scope.gotoPrimaryCarePage = function(searchInput) {
                TransparencyFactory.setResultsTerm(searchInput.searchTerm);
                return $rootScope.gotoView(
                  searchInput.link +
                  '?id=260005172&network_id=' +
                  $rootScope.selectedPlan.id +
                  '&distance=' +
                  TransparencyFactory.getDistance() +
                  '&searchTerm=' +
                  searchInput.searchTerm +
                  '&zipCode=' +
                  TransparencyFactory.getCity().zip +
                  '&planName=' +
                  searchInput.planName +
                  '&isPcpFlow=true'
                );
              };

              $scope.openInformationModal = function(pcpInformation) {
                $rootScope.headerTerm =
                  pcpInformation.modalHeader;
                $scope.helpInfo = {
                  pcpModalText: pcpInformation.modalText,
                  pcpInfo: true,
                };
                helpService.help($scope.helpInfo);
              };

              $scope.gotoDetailsPage = function(event, index, displayMember) {
                TransparencyFactory.setResultsDetailsTerm($scope.dependentPcpDetails.providerData[index].selectedPrimaryCarePhysician.pcpFullName);
                var requestParms = {
                  network_id: $rootScope.selectedPlan && $rootScope.selectedPlan.id,
                  accountId: $rootScope.selectedPlan && $rootScope.selectedPlan.accountId,
                  planName: ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name,
                  zipCode: $scope.dependentPcpDetails.providerData[index].selectedPrimaryCarePhysician.providerZipCode,
                  locationName: encodeURIComponent($scope.dependentPcpDetails.providerData[index].selectedPrimaryCarePhysician.providerOrganizationName),
                  doctorName: $scope.dependentPcpDetails.providerData[index].selectedPrimaryCarePhysician.pcpFullName
                };
                $rootScope.$emit('pageLoading');

                findDoctorService.getDoctorDetails(requestParms)
                  .then(function(doctorResult) {
                    if (doctorResult.results && doctorResult.results.length) {
                      var viewUrl = '/find-doctor-results-details?' +
                        '&location=' + doctorResult.results[0].location_id +
                        '&provider=' + doctorResult.results[0].provider_id +
                        '&dependentName=' + displayMember +
                        '&viewPcpDetails=true&dependentPcp=true';
                      // Go to view.
                      $rootScope.gotoView(viewUrl);
                    } else {
                      $rootScope.$emit('pageLoaded');
                      $scope.dependentPcpDetails.providerData[index].displayErrorMessage = true;
                      $scope.dependentPcpDetails.displayErrorMessage = true;
                      event.target.parentNode.parentNode.style.display = 'none';
                      return;
                    }
                  }).catch(function(error) {
                    $rootScope.$emit('pageLoaded');
                    $scope.dependentPcpDetails.providerData[index].displayErrorMessage = true;
                    $scope.dependentPcpDetails.displayErrorMessage = true;
                    event.target.parentNode.parentNode.style.display = 'none';
                    return error;
                  });
              };
            },
          ],
        };
      },
    ]);
})();
