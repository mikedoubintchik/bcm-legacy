/**
 * Controller for the claims page view.
 *
 * @namespace Controllers
 * @class ClaimsController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.claims', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('ClaimsController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$routeParams',
    '$window',
    'adobeService',
    'coachmarkService',
    'pageService',
    'analyticConstants',
    function($scope, $rootScope, $location, $timeout, $routeParams, $window, adobeService, coachmarkService, pageService, analyticConstants) {
      $rootScope.showNav = true;
      $rootScope.showPolicySelect = true;

      var languageAttempts = 0;
      var section = 'claimsOverview';
      var cachePage = true;

      $scope.getPage = function() {
        /**
        * The directive HTML for the page.
        *
        * @memberof ClaimsController
        * @member {String} pageHtml
        */
        $scope.pageHtml = '';

        $scope.basicNavbarLeftClick = function() {
          $window.history.back();
        };

        if (!$rootScope.loc) {
          languageAttempts++;
          if (languageAttempts > 5) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
            return;
          }

          return $timeout($scope.getPage, 100);
        }

        $rootScope.pageTitle = $rootScope.loc.CLAIMS;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;

        var pageName = 'claims';
        var query = $location.search();
        query.policyIndex = $rootScope.policyIndex;

        if ($routeParams.id) {
          $rootScope.showPolicySelect = false;
          $rootScope.pageTitle = $rootScope.loc.CLAIM_DETAILS;
          $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
          pageName = 'claim-details';
          section = 'claimDetails';

          query.id = $routeParams.id;
          query.dependentNo = $routeParams.dependentNo;

        }
        else if ($location.url().indexOf('/claims/search') > -1) {
          pageName = 'claims-search';
          section = 'claimsSearch';

        }
        else if ($location.url().indexOf('/claims/filter') > -1) {
          $scope.keyword = query.keyword;
          $rootScope.showNav = false;
          $rootScope.showPolicySelect = false;

          if (query.keyword) {
            pageName = 'claims-filter/?keyword=' + query.keyword;
          }
          else {
            pageName = 'claims-filter';
          }

          section = 'claimsSearchFilter';
          
        }
        else { //On claims page setting query data to blank or default.
          query.keyword = "";
          query.claimsStatus = "";
          query.fromDate = "";
          query.toDate = "";
          query.dependentNo = "";
        }

        $rootScope.startingView = section;
        query.url = $location.path();
        query.policyEffectiveDate = $rootScope.selectedPolicy.effectiveDate;
        query.policyExpirationDate = $rootScope.selectedPolicy.expirationDate;
        query.policyExternalId = $rootScope.selectedPolicy.externalId;

        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query, cachePage).then(function(pageHtml) {
            $scope.noTabsVisible = pageHtml.indexOf('tab-select') === -1;
            $rootScope.$emit('pageLoaded');
            $scope.pageHtml = pageHtml;
            adobeService.trackState(section, analyticConstants.CLAIMS_SECTION);
            return coachmarkService.showCoachmarks('claims');
          }, function() {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
          });
      };

      /**
       * Turns off the policy select listener when called.
       *
       * @memberof ClaimsController
       * @method policyListenerOff
       */
      $scope.policyListenerOff = $rootScope.$on('policySelected', function() {
        if ($location.path() == '/claims/search') { //We want to force the app back to the claims view page if the policy is changed while on search page.
          $location.path('/claims');
        }

        if ($location.path() !== '/claims') {
          $scope.policyListenerOff();
          return;
        }

        $scope.getPage();
      });

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
