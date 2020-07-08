/**
 * @description Controller for the landing page view.
 * @namespace Controllers
 * @class LandingController
 */
(function () {
  'use strict';

  angular
    .module('blueconnect.mobile.controllers.landing', [])
    .controller('LandingController', [
      '$rootScope',
      'cordovaService',
      function ($rootScope, cordovaService) {
        $rootScope.showNav = false;
        $rootScope.showPolicySelect = false;
        $rootScope.loggedIn = false;

        if (typeof cordova === 'undefined') {
          return $rootScope.gotoView('/login');
        }

        $rootScope.checkNetwork();
        $rootScope.verifyLocaleRetrieved();

        document.addEventListener('deviceready', checkSecuritySettings, false);
        document.addEventListener('pause', inactivityListener);

        function checkSecuritySettings() {
          // Check inactive period.
          var inactiveWindow = $rootScope.pauseTime ? new Date(
            $rootScope.pauseTime.getTime() + 72 * 1000 * 60
          ): 0;

          if (!$rootScope.pausedForShare && inactiveWindow < new Date()) {
            $rootScope
              .checkNetwork()
              .then(function(networkObj) {
                if (networkObj.offline && !networkObj.online) {
                  angular.element('.page-no-connection').hide();
                  $rootScope.gotoView('/network-landing-local');
                  throw new Error('Device is offline');
                }
              })
              .then(function() {
                return cordovaService.checkDeviceType();
              })
              .then(function() {
                return cordovaService.verifyMinAppVersion();
              })
              .then(function () {
                $rootScope.gotoView('/login');
              })
              .catch(function(error) {
                console.error(error);
              });
          }
        }

        function inactivityListener() {
          $rootScope.pauseTime = new Date();
        }
    }]);
})();
