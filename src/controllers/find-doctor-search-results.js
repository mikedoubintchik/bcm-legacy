/**
 * Controller for the Find A Doctor Search Results view.
 *
 * @namespace Controllers
 * @class FindDoctorSearchResultsController
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.controllers.findDoctorSearchResults', [
      'bcbsnc.cloud.services.page'
    ])
    .controller('FindDoctorSearchResultsController', [
      '$scope',
      '$rootScope',
      '$location',
      '$anchorScroll',
      '$timeout',
      'pageService',
      'TransparencyFactory',
      function($scope, $rootScope, $location, $anchorScroll, $timeout, pageService, TransparencyFactory) {
        var pageName = 'find-doctor-search-results';
        $rootScope.$emit('pageLoading');

        // Record the path upon entering the controller
        $scope.controllerLocation = $location.path();
        $scope.pageHtml = '';

        var query = $location.search();
        query.loggedIn = $rootScope.loggedIn;
        
        query.planName = ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) ? $rootScope.selectedPlan.lobDesc : $rootScope.selectedPlan.name;
        query.vitalsMatchedPlanName = ($rootScope.loggedIn) ? $rootScope.selectedPlan.vitalsMatchedPlanName : '';

        
        if (TransparencyFactory.getCity().geo) {
          query.geo_location = TransparencyFactory.getCity().geo;
        } else {
          query.geo_location = $rootScope.vitalsGeoCoords;
        }

        if (!query.latlon) {
          $rootScope.searchAreaNearestCity = null;
        }
        
        if (!query.zipCode) {
          query.zipCode = TransparencyFactory.getCity().zip;
        }
        if (!query.distance) {
          query.distance = TransparencyFactory.getDistance();
        }
        query.accountId = TransparencyFactory.getSelectedPlan().accountId;
        query.resultsTerm = encodeURIComponent(TransparencyFactory.getResultsTerm() ? TransparencyFactory.getResultsTerm() : $rootScope.resultsTermsArr[0]);

        if ($rootScope.loggedIn) {
          $rootScope.pageTitle = $rootScope.loc.FIND_CARE;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;
          $rootScope.showNav = false;
          $rootScope.showPolicySelect = false;
          query.vitalsMatchedPlanName = $rootScope.selectedPolicy.vitalsMatchedPlanName;
          query.policyIndex = $rootScope.policyIndex;
          query.policyEffectiveDate = $rootScope.selectedPolicy.effectiveDate;
          query.policyExpirationDate = $rootScope.selectedPolicy.expirationDate;
          query.policyExternalId = $rootScope.selectedPolicy.externalId;
        }

        if ($rootScope.loggedIn && !$rootScope.noMatchPlanFound) {
        query.jwt = $rootScope.vitalsJWT;
        query.signature = $rootScope.vitalsSignature && $rootScope.vitalsSignature.signature;
        }

        if (query.filters) {
          var tierData = TransparencyFactory.getFilterTierSelectedTerm();
          query.tierDataType = tierData.type || '';
          query.tierDataValue = tierData.value || '';
          query.specialty = TransparencyFactory.getFilterSpecialtySelectedTerm() || '';
          query.gender = TransparencyFactory.getFilterGenderSelectedTerm() || '';
          query.smartShopperRewardsFilter = TransparencyFactory.getSmartShopperFilter() || '';
        }

        // If returning from the results details view, skip Vitals call on backend
        if (TransparencyFactory.getResultsDetailsIndex() !== null) {
          query.callVitals = false;
        }

        // Set query in $scope, as it's needed inside the associated directive.
        $scope.query = query;
        query.deviceType = $rootScope.device;                            

        pageService
          .getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query)
          .then(function(pageHtml) {
            // If returning from the results details view, update pageHtml with existing results
            if (TransparencyFactory.getResultsDetailsIndex() !== null) {
              // Replace " with ' in the existing results string
              var existingResults = JSON.stringify(TransparencyFactory.getExistingSearchResults()).replace(/(\")/g, '\'');

              // Create updated <find-doctor-search-results> HTML element
              var updatedResultsElem = '<find-doctor-search-results search-results-details=\"' +  existingResults + '\"></find-doctor-search-results>';

              // Regular expression to match the <find-doctor-search-results> element
              var replaceExpr = /<find-doctor-search-results\ssearch-results-details=\"(.*)\"><\/find-doctor-search-results>/g;

              // Update the received pageHtml with existing results
              var newHtml = pageHtml.replace(replaceExpr, updatedResultsElem);

              $rootScope.$emit('pageLoaded');
              $rootScope.healthNavTrackStates(1, query);

              // Update the pageHtml with existing results
              $scope.pageHtml = newHtml;

              // Go to the results card the user had previously clicked
              $scope.gotoAnchor('search-results-card-' + TransparencyFactory.getResultsDetailsIndex());

              // Reset the result details index clicked back to null
              TransparencyFactory.setResultsDetailsIndex(null);
            } else {
              $rootScope.$emit('pageLoaded');
              $rootScope.healthNavTrackStates(1, query);
              $scope.pageHtml = pageHtml;
            }
          })
          .catch(function(error) {
            $rootScope.$emit('pageLoaded');
            if ($rootScope.loggedIn) {
              $rootScope.showNetworkErrorAlert();
            } else {
              $rootScope.showNetworkErrorUnautenticated();
            }
          });

        // Function used to pin the results card previously clicked to the top of the view
        $scope.gotoAnchor = function(resultId) {
          $timeout(function() {
            $location.hash(resultId);
            $anchorScroll();
          }, 100);
        };

        // If we are just moving between tags on the same page, supress the $locationChangeStart event
        $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
          // Suppress event only if the URL path is remaining the same and the new hash is non-empty
          // The new hash being non-empty imlies that we are moving to an actual achor on the page
          if (($scope.controllerLocation === $location.path()) && ($location.hash() !== '')) {
            event.preventDefault();
          }
        });
      }
    ]);
}());
