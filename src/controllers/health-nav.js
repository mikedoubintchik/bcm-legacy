/**
 * Controller for the healthNav view.
 *
 * @namespace Controllers
 * @class HealthNavController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.healthNav', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('HealthNavController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$window',
    'pageService',
    'analyticConstants',
    function($scope, $rootScope, $location, $timeout, $window, pageService, analyticConstants) {
      $rootScope.showNav = false;
      $rootScope.showPolicySelect = false;
      $scope.alertModal = $rootScope.alertModal;

      var languageAttempts = 0;
      
      $rootScope.startingView = analyticConstants.HEALTHNAV_SECTION;

      /**
       *Display the alert window for external link to open the url in browser
       **/
      $scope.openInBrowser = $rootScope.openInBrowser;

      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof HealthNavController
       * @method getPage
       */
       $scope.getPage = function() {
         /**
         * The directive HTML for the page.
         *
         * @memberof HealthNavController
         * @member {String} pageHtml
         */
         $scope.pageHtml = '';

         /**
         * For basicNavbar, we have to pass this function
         * to handle the left click
         */
        $scope.basicNavbarLeftClick = function() {
          if($rootScope.loggedIn) {
            $window.history.back();
          } else {
            $timeout($location.path('/login'), 100);
          }
        };

        if(!$rootScope.loc) {
          languageAttempts++;
          if(languageAttempts > 5) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
            return;
          }

          $timeout($scope.getPage, 100);
          return;
        }
        $rootScope.selectedPolicy = $rootScope.selectedPolicy || {};
        var query = {
          policyIndex: ($rootScope.loggedIn) ? $rootScope.policyIndex : null,
          policyEffectiveDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null,
          policyExpirationDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null,
          policyExternalId : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null,
          loggedIn : $rootScope.loggedIn
        };

        var pageName = 'health-nav';
        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
        }, function(error, status) {
          $rootScope.$emit('pageLoaded');
          if ($rootScope.loggedIn) {
            $rootScope.showNetworkErrorAlert();
          } else {
            $rootScope.showNetworkErrorUnautenticated();
          }
        });
      };

      $rootScope.verifyLocaleRetrieved();
      $scope.getPage();
    }
  ]);
}());
