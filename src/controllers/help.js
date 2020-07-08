/**
 * Controller for the help page view.
 *
 * @namespace Controllers
 * @class HelpController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.help', [
    'bcbsnc.cloud.services.page'
  ])
  .controller('HelpController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$window',
    'pageService',
    'adobeService',
    'analyticConstants',
    function($scope, $rootScope, $location, $timeout, $window, pageService, adobeService, analyticConstants) {
      if ($rootScope.loggedIn) {
        $rootScope.showNav = true;
      }
      $rootScope.showPolicySelect = false;
      $scope.alertModal = $rootScope.alertModal;

      var languageAttempts = 0;

      /**
       * Retrieves the page HTML from the page service. Called on view load.
       *
       * @memberof HelpController
       * @method getPage
       */
      $scope.getPage = function() {
        /**
        * The directive HTML for the page.
        *
        * @memberof HelpController
        * @member {String} pageHtml
        */
        $scope.pageHtml = '';

        /**
         * For basicNavbar, we have to pass this function
         * to handle the left click
         */
        $scope.basicNavbarLeftClick = function() {
          $rootScope.fromBackButton = true;
          $rootScope.detailsFromBackButton = true;
          $window.history.back();
        };

        if (!$rootScope.loc) {
          languageAttempts++;
          if (languageAttempts > 5) {
            $rootScope.$emit('pageLoaded');
            $rootScope.showNetworkErrorAlert();
            return;
          }

          $timeout($scope.getPage, 100);
          return;
        }

        var pageName = 'help';
        $rootScope.pageTitle = $rootScope.loc.CUSTOMER_SERVICE_AND_HELP_PAGE;
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;
        var query = {
          loggedIn : $rootScope.loggedIn, 
          policyIndex: ($rootScope.loggedIn) ? $rootScope.policyIndex : null, 
          deviceType : $rootScope.device, 
          planId : ($rootScope.loggedIn)? $rootScope.selectedPolicy.id : null, 
          vitalsMatchedPlanName : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.vitalsMatchedPlanName : null,
          policyEffectiveDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.effectiveDate : null,
          policyExpirationDate : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.expirationDate : null,
          policyExternalId : ($rootScope.loggedIn) ? $rootScope.selectedPolicy.externalId : null
        };


        $rootScope.$emit('pageLoading');
        pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
          $rootScope.$emit('pageLoaded');
          $scope.pageHtml = pageHtml;
          adobeService.trackState(pageName, analyticConstants.HELP_SECTION);
        }, function() {
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
