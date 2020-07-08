/**
 * Directive for the home card pcp.
 *
 * @namespace Directives
 * @class homeCardPcp
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.homecardPcp', [])
    .directive('homeCardPcp', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/home-card-pcp.html',
          scope: {
            /**
             * Display information for the pcp home card.
             *
             * @memberof about
             * @member {Object} pcpDetails
             */
            pcpDetails: '=',
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
            'adobeService',
            'analyticConstants',
            function(
              $rootScope,
              $scope,
              $filter,
              TransparencyFactory,
              geoLocationService,
              $timeout,
              helpService,
              findDoctorService,
              adobeService,
              analyticConstants
            ) {
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.loc = $rootScope.loc;
              $scope.policy = $rootScope.selectedPolicy;
              $scope.detailsPage = null;
              $scope.policyMembersList = TransparencyFactory.getCurrentPolicyMembers();
              $scope.medicareUser = ($scope.policy.sourceSystem == 'Amisys');

              
              /**
               * Retrieves the policy dates display string.
               *
               * @memberof homeCardPcp
               * @param  {Object} policy The policy to get dates for.
               * @method getPolicyDates
               */
              $scope.getPolicyDates = function(policy) {
                var startDate =
                  $rootScope.loc[
                  $filter('date')(policy.effectiveDate, 'MMM').toUpperCase()
                  ] + $filter('date')(policy.effectiveDate, ' yyyy');
                var endDate =
                  $rootScope.loc[
                  $filter('date')(policy.expirationDate, 'MMM').toUpperCase()
                  ] + $filter('date')(policy.expirationDate, ' yyyy');
                var policyYear = $filter('date')(policy.effectiveDate, 'yyyy');
                var expirationMonth =
                  $rootScope.loc[
                  $filter('date')(
                    new Date('December 31, 0000 00:00:00'),
                    'MMM'
                  ).toUpperCase()
                  ];

                if (
                  new Date(policy.expirationDate) >= new Date() &&
                  policy.active
                ) {
                  endDate = $rootScope.loc.ACTIVE;
                } else if (
                  new Date(policy.expirationDate) >= new Date() &&
                  !policy.active
                ) {
                  endDate = expirationMonth + ' ' + policyYear;
                }

                return startDate + ' - ' + endDate;
              };

              /**
               * Selects a policy type title
               *
               * @memberof homeCardPcp
               * @method getPolicyPlanTitle
               */
              $scope.getPolicyPlanTitle = function(policy) {
                var response;
                if (
                  new Date(policy.expirationDate) < new Date() &&
                  (policy.isMedical || policy.isPharmacy)
                ) {
                  response = $rootScope.loc.HEALTH_PLAN_INACTIVE;
                } else if (
                  new Date(policy.expirationDate) < new Date() &&
                  policy.isDental
                ) {
                  response = $rootScope.loc.DENTAL_PLAN_INACTIVE;
                } else if (
                  new Date(policy.expirationDate) < new Date() &&
                  policy.isVision
                ) {
                  response =
                    $rootScope.loc.BLUE2020_HEADER_VISION_PLAN_INACTIVE;
                } else if (policy.isMedical || policy.isPharmacy) {
                  response = $rootScope.loc.HEALTH_PLAN;
                } else if (policy.isDental) {
                  response = $rootScope.loc.DENTAL_PLAN;
                } else if (policy.isVision) {
                  response = $rootScope.loc.BLUE2020_HEADER_VISION_PLAN;
                } else {
                  response = $rootScope.loc.HEALTH_PLAN;
                }
                return response;
              };

              $scope.gotoManageDependentPcp = function() {
                $rootScope.gotoView('/pcp-manage-dependents-pcp');
              };

              $scope.otherPcpSearch = function(searchInput) {
                if ($scope.policy.sourceSystem === 'Amisys') {
                  $rootScope.city = $scope.pcpDetails.getCityForAmisysUser;
                  TransparencyFactory.setCity($scope.pcpDetails.getCityForAmisysUser)
                  .setZipRangeNC($scope.pcpDetails.geoLocationDetails.distanceDetails.NCZipMin, $scope.pcpDetails.geoLocationDetails.distanceDetails.NCZipMax);
                }
                
                if (
                  TransparencyFactory.getCity() &&
                  TransparencyFactory.getCity().zip
                ) {
                  $scope.gotoPrimaryCarePage(searchInput);
                } else {
                  TransparencyFactory.setZipRangeNC($scope.pcpDetails.geoLocationDetails.distanceDetails.NCZipMin, $scope.pcpDetails.geoLocationDetails.distanceDetails.NCZipMax);
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
                            $scope.pcpDetails.geoLocationDetails.distanceDetails.currentLocation;
                          $scope.gotoPrimaryCarePage(searchInput);
                        } else if (response === 'position not found') {
                          TransparencyFactory.setLocationBlocked(true);
                          TransparencyFactory.setGeoLocationStatus(false);
                          TransparencyFactory.setLocationMsg(
                            $scope.pcpDetails.geoLocationDetails.locationMsg
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
                      $scope.pcpDetails.geoLocationDetails.locationMsg
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
                $scope.gotoPrimaryCarePage($scope.pcpDetails.searchInput);
              };

              if ($scope.pcpDetails.noPCP) {
                adobeService.trackAction('noPCPSelected', analyticConstants.PCP_SECTION);
              }

              if ($scope.pcpDetails.geoLocationDetails) {
                $scope.modalObj = {
                  locationMsg: $scope.pcpDetails.geoLocationDetails.locationMsg,
                  pcp: true,
                  cancelButton: {
                    title: $scope.loc.CANCEL,
                  },
                  confirmButton: {
                    title: $scope.loc.CONTINUE,
                  },
                  values: {
                    distanceDetails:
                      $scope.pcpDetails.geoLocationDetails.distanceDetails,
                    distance: TransparencyFactory.getDistance()
                      ? TransparencyFactory.getDistance().toString()
                      : $scope.pcpDetails.geoLocationDetails.distanceDetails.distance.toString(),
                    city: TransparencyFactory.getCity(),
                  },
                };
              }

              $scope.gotoPrimaryCarePage = function(searchInput) {
                $scope.searchTermId = ($rootScope.selectedPlan.sourceSystem === 'Amisys') ? '260005173' : '260005172';
                TransparencyFactory.setResultsTerm(searchInput.searchTerm);
                return $rootScope.gotoView(
                  searchInput.link +
                  '?id=' + $scope.searchTermId + '&network_id=' +
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

              $scope.gotoDetailsPage = function(providerList) {
                if ($scope.policy.sourceSystem === 'Amisys') {
                  $rootScope.city = $scope.pcpDetails.getCityForAmisysUser;
                  TransparencyFactory.setCity($scope.pcpDetails.getCityForAmisysUser)
                  .setZipRangeNC($scope.pcpDetails.geoLocationDetails.distanceDetails.NCZipMin, $scope.pcpDetails.geoLocationDetails.distanceDetails.NCZipMax);
                }
                var recommendedFlow = false;
                var requestParms = null;
                if (providerList) { // only if the selection is from recommendation list
                  recommendedFlow = true;
                  if (providerList.vendorSource === 'Nuna'){
                    providerList.fullName = providerList.firstName + ' ' + providerList.middleInitial + ' ' + providerList.lastName;
                    providerList.zipCode = providerList.fullAddress.substring(providerList.fullAddress.length - 5);
                  }
                  TransparencyFactory.setResultsDetailsTerm(providerList.fullName)
                  .setRecommendedPcpData(providerList);
                  requestParms = {
                    network_id: $rootScope.selectedPlan && $rootScope.selectedPlan.id,
                    accountId: $rootScope.selectedPlan && $rootScope.selectedPlan.accountId,
                    planName: ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name,
                    zipCode: providerList.zipCode,
                    locationName: encodeURIComponent(providerList.practiceName),
                    doctorName: providerList.fullName
                  };
                } else {
                  TransparencyFactory.setResultsDetailsTerm($scope.pcpDetails.providerData.pcpFullName);
                  requestParms = {
                    network_id: $rootScope.selectedPlan && $rootScope.selectedPlan.id,
                    accountId: $rootScope.selectedPlan && $rootScope.selectedPlan.accountId,
                    planName: ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name,
                    zipCode: $scope.pcpDetails.providerData.providerZipCode,
                    locationName: encodeURIComponent($scope.pcpDetails.providerData.providerOrganizationName),
                    doctorName: $scope.pcpDetails.providerData.pcpFullName
                  };
                }
                $rootScope.$emit('pageLoading');

                findDoctorService.getDoctorDetails(requestParms)
                  .then(function(doctorResult) {
                    if (doctorResult.results && doctorResult.results.length) {
                      var viewUrl = '/find-doctor-results-details?' +
                        '&location=' + doctorResult.results[0].location_id +
                        '&provider=' + doctorResult.results[0].provider_id +
                  '&viewPcpDetails=true&recommendedFlow='+ recommendedFlow;
                      // Go to view.
                      $rootScope.gotoView(viewUrl);
                    } else {
                      $rootScope.$emit('pageLoaded');
                      $scope.pcpDetails.displayErrorMessage = true;
                      return;
                    }
                  }).catch(function(error) {
                    $rootScope.$emit('pageLoaded');
                    $scope.pcpDetails.displayErrorMessage = true;
                    return error;
                  });
              };

              $scope.expandRecommendationList = function() {
                $scope.expandRecommendations = !$scope.expandRecommendations;
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

              $scope.gotoManageDependentPcp = function() {
                $rootScope.gotoView('/pcp-manage-dependents-pcp');
              };
            },
          ],
        };
      },
    ]);
})();
