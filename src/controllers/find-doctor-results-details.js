/**
 * Controller for the Find A Doctor Results Details view.
 *
 * @namespace Controllers
 * @class FindDoctorResultsDetailsController
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.controllers.findDoctorResultsDetails', [
      'bcbsnc.cloud.services.page',
    ])
    .controller('FindDoctorResultsDetailsController', [
      '$scope',
      '$rootScope',
      '$location',
      'pageService',
      'TransparencyFactory',
      function(
        $scope,
        $rootScope,
        $location,
        pageService,
        TransparencyFactory
      ) {
        var pageName = 'find-doctor-results-details';
        var query = $location.search();
 
        query.loggedIn = $rootScope.loggedIn;
        query.policyIndex = ($rootScope.loggedIn) ? $rootScope.policyIndex : null;
        query.planName = ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name;
        query.vitalsMatchedPlanName = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.vitalsMatchedPlanName : '';
        query.statePlan = ($rootScope.loggedIn) ? $rootScope.selectedPlan.state : null;
        query.policyEffectiveDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null;
        query.policyExpirationDate = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null;
        query.policyExternalId = ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null;
        query.deviceType = $rootScope.device;                    

        query.network_id =
          $rootScope.selectedPlan && $rootScope.selectedPlan.id;
        query.accountId =
          $rootScope.selectedPlan && $rootScope.selectedPlan.accountId;
        if ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) {
          query.jwt = $rootScope.vitalsJWT;
          query.member_number = $rootScope.selectedPlan.alphaPrefix + $rootScope.selectedPlan.externalId;
          query.externalSourceId = $rootScope.selectedPlan.externalId;
          query.internalId = $rootScope.selectedPlan.internalId;
          query.groupId = $rootScope.selectedPlan.groupNumber;
          query.sourceSystem = $rootScope.selectedPlan.sourceSystem;
          query.fundingAccountTypeCode = $rootScope.selectedPlan.attributes
            .filter(function(attributeObject){
              return attributeObject.paymentPortalFundType !== null;
            })
            .map(function(attributeObject) {
              return attributeObject.paymentPortalFundType;
            })[0];
        }

        if (!query.viewPcpDetails) {
          query.zipCode = TransparencyFactory.getCity().zip;
          query.distance = TransparencyFactory.getDistance();
          // Adding selected provider_id and location_id to the query
          var resultDetailsItemToFetch = TransparencyFactory.getResultsDetailsItem();
        }
        
        query.resultsTerm = TransparencyFactory.getResultsDetailsTerm();


        // Check existing query for provider/location.
        query.location_id = query.location || resultDetailsItemToFetch.location_id;
        query.provider_id = query.provider || resultDetailsItemToFetch.provider_id;

        // Adding the card name 'default' for the main details view
        query.card = 'default';

        if ($rootScope.loggedIn) {
          $rootScope.showNav = false;
          $rootScope.showPolicySelect = false;
        }

        $rootScope.$emit('pageLoading');
        pageService
          .getPage(
            pageService.devices.MOBILE,
            pageName,
            $rootScope.language,
            query
          )
          .then(function(pageHtml) {
            $rootScope.$emit('pageLoaded');
            $rootScope.healthNavTrackStates(2, query);
            $scope.pageHtml = pageHtml;
          })
          .catch(function(error) {
            $rootScope.$emit('pageLoaded');
            if ($rootScope.loggedIn) {
              $rootScope.showNetworkErrorAlert();
            } else {
              $rootScope.showNetworkErrorUnautenticated();
            }
          });
      },
    ]);
})();
