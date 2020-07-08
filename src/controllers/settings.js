/**
 * Controller for the application settings view
 *
 * @namespace Controllers
 * @class SettingsController
 */
(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.controllers.settings', ['bcbsnc.cloud.services.page'])
    .controller('SettingsController', [
      '$scope',
      '$rootScope',
      '$timeout',
      '$window',
      'pageService',
      'adobeService',
      'analyticConstants',
      function($scope, $rootScope, $timeout, $window, pageService, adobeService, analyticConstants) {
        $rootScope.showNav = false;
        $rootScope.showPolicySelect = false;
        $scope.loc = $rootScope.loc;

        /**
         * Retrieves the page HTML from the page service. Called on view load.
         *
         * @memberof SettingsController
         * @method getPage
         */
        $scope.getPage = function() {
          /**
           * The directive HTML for the page.
           *
           * @memberof SettingsController
           * @member {String} pageHtml
           */
          $scope.pageHtml = '';

        if (!$rootScope.language) {
          $timeout($scope.getPage, 100);
          return;
        }


          $rootScope.leftNavButton = $rootScope.leftNavButtonType.BACK;

          /**
           * For basicNavbar, we have to pass this function
           * to handle the left click
           */
          $scope.basicNavbarLeftClick = function() {
            $rootScope.fromBackButton = true;
            $rootScope.detailsFromBackButton = true;
            $window.history.back();
          };

          var pageName = 'Settings';

          $rootScope.$emit('pageLoading');
          pageService
            .getPage(
              pageService.devices.MOBILE,
              pageName,
              $rootScope.language,
              $rootScope.touchIdAvailable
                ? {
                    biometricType: $rootScope.touchIdAvailable,
                  }
                : {}
            )
            .then(function(pageHtml) {
              $rootScope.$emit('pageLoaded');
              $scope.pageHtml = pageHtml;
              adobeService.trackState('settings', analyticConstants.SETTINGS_SECTION);
            });
        };

        $rootScope.verifyLocaleRetrieved();
        $scope.getPage();
      },
    ]);
})();
