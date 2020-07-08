/**
 * Controller for the setup page view.
 *
 * @namespace Controllers
 * @class SetupController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.setup', [
    'blueconnect.mobile.services.touchId',
    'blueconnect.mobile.services.androidFingerprintAuth'
  ])
  .controller('SetupController', [
    '$scope',
    '$rootScope',
    '$location',
    'cordovaService',
    'touchIdService',
    'androidFingerprintAuthService',
    'adobeService',
    'analyticConstants',
    function($scope, $rootScope, $location, cordovaService, touchIdService, androidFingerprintAuthService, adobeService, analyticConstants) {
      $rootScope.showNav = false;
      $rootScope.showPolicySelect = false;

      $scope.itemIndex = 0;

      // CRIT [runs in order to check which type of device you are on during setup]
      if (typeof cordova !== 'undefined') {
        document.addEventListener('deviceready', function() {
          cordovaService.checkDeviceType();
        }, false);
      }


      /**
       * Navigates to a setup card/item.
       *
       * @memberof SetupController
       * @method gotoItem
       * @param {Number} index The item to go to.
       */
      $scope.gotoItem = function(index) {
        if (index < 0) {
          index = 0;
        }
        if (index > 2) {
          index = 2;
        }

        if (index === 1 && !$scope.hasPresetSecurity()) {
          $scope.securitySetting = {
            high: true,
            medium: false,
            standard: false
          };
          $scope.trackSettingAction($scope.securitySetting);
          $scope.setLoginSettingsToLevel('high');
        }

        if (index === 1 && !$scope.securitySetting.standard || (typeof cordova !== 'undefined' && !$rootScope.touchIdAvailable) ) {
          if (index < $scope.itemIndex) {
            index = 0;
          }
          else {
            index = 2;
            $scope.trackSettingAction($scope.securitySetting);
            $scope.saveLoginSettings();
          }
        }
        else if (index === 2) {
          $scope.saveLoginSettings();
        }
        else if (index === 1) {
          $scope.trackSettingAction($scope.securitySetting);
        }

        $scope.itemIndex = index;
        var left = index * -100 + (index + 1) * 5;
        angular.element('.setup-carousel').animate({left: left + '%'}, 125);
      };

      /**
       * Sets security settings to custom.
       *
       * @memberof SetupController
       * @method selectCustomSecurity
       */
      $scope.selectCustomSecurity = function() {
        $scope.securitySetting = {
          high: false,
          medium: false,
          standard: false
        };

        $scope.gotoItem(1);
      };

      $scope.trackSettingAction = function(settings) {
        var action = null;
        Object.keys(settings).forEach(function(element){
          if (settings[element]) {
            action = 'settings:update:'+ element;
            adobeService.trackAction(action, analyticConstants.SETTINGS_SECTION);
          }
        });
      };

      /**
       * Gets the localized description text of the security level.
       *
       * @memberof SetupController
       * @method getCustomSecurityText
       */
      $scope.getCustomSecurityText = function() {
        if (!$scope.securitySetting) {
          return '';
        }

        if ($scope.securitySetting.high) {
          return $rootScope.loc.HIGH;
        }
        else if ($scope.securitySetting.medium) {
          return $rootScope.loc.MEDIUM;
        }

        return $rootScope.loc.STANDARD;
      };

      /**
       * Verifies if the user has selected a security preset.
       *
       * @memberof SetupController
       * @method hasPresetSecurity
       * @return {Boolean} Whether a security preset was selected.
       */
      $scope.hasPresetSecurity = function() {
        for (var key in $scope.securitySetting) {
          if ($scope.securitySetting[key]) {
            return true;
          }
        }

        return false;
      };

      /**
       * Sets security settings to a preset.
       *
       * @memberof SetupController
       * @method setLoginSettingsToLevel
       * @param {String} level The preset level.
       */
      $scope.setLoginSettingsToLevel = function(level) {

        switch (level) {
          case 'high':
            $scope.lockApp = true;
            $scope.lockAfter = 0;
            $scope.stayLoggedIn = false;
            $scope.rememberUserId = false;
            $scope.useTouchId = false;
            break;
          case 'medium':
            $scope.lockApp = true;
            $scope.lockAfter = 20;
            $scope.stayLoggedIn = false;
            $scope.rememberUserId = true;
            $scope.useTouchId = false;
            break;
          case 'standard':
            $scope.lockApp = true;
            $scope.lockAfter = 30;
            $scope.stayLoggedIn = true;
            $scope.rememberUserId = true;
            break;
          default:
            break;
        }
      };

      /**
       * Saves the login settings.
       *
       * @memberof SetupController
       * @method saveLoginSettings
       */
      $scope.saveLoginSettings = function() {
        var loginSettings = {
          lockApp: $scope.lockApp || false,
          lockAfter: parseInt($scope.lockAfter, 10) || 0,
          stayLoggedIn: $scope.stayLoggedIn || false,
          rememberUserId: $scope.rememberUserId || false,
          useTouchId: $scope.useTouchId || false
        };

        if (!$rootScope.appSettings) {
          $rootScope.appSettings = {};
        }
        $rootScope.appSettings.login = loginSettings;
      };

      /**
       * Confirms the user's fingerprint if they have Touch ID.
       *
       * @memberof SetupController
       * @method confirmFingerprint
       */
      $scope.confirmFingerprint = function() {
        $scope.useTouchId = true;

        if ($rootScope.iphone == true) {
          touchIdService.verifyFingerprint().then(function() {
            // $scope.gotoItem($scope.itemIndex + 1);
            $rootScope.fingerprintOK();
          }, function() {
            // $scope.useTouchId = false;
            $rootScope.fingerprintNotOK();
          });
        }

        if ($rootScope.android === true) {
          FingerprintAuth.isAvailable(androidFingerprintAuthService.isAvailableSuccess,androidFingerprintAuthService.isAvailableError);
        }
      };

      $rootScope.fingerprintOK = function() {
        adobeService.trackAction('settings:update:touchIdOn', analyticConstants.SETTINGS_SECTION);
        $scope.gotoItem($scope.itemIndex + 1);
      };

      $rootScope.fingerprintNotOK = function() {
        adobeService.trackAction('settings:update:touchIdOff', analyticConstants.SETTINGS_SECTION);
        $scope.useTouchId = false;
      };



      /**
       * Disables the use of TouchID when it's available in the system.
       *
       * @memberof SetupController
       * @method disableTouchId
       */
      $scope.disableTouchId = function() {
        $scope.useTouchId = false;
        adobeService.trackAction('settings:update:touchIdOff', analyticConstants.SETTINGS_SECTION);
        $scope.gotoItem($scope.itemIndex + 1);
      };

      /**
       * Retrieves remote locale and loads the home page.
       *
       * @memberof SetupController
       * @method loadHomePage
       */
      $scope.loadHomePage = function() {
        $scope.getLocale().then(function() {
          $rootScope.gotoView('/home');
        });
      };

      $scope.settingsWatchOff = $scope.$watch('securitySetting', function(newVal, oldVal) {
        if ($location.url() !== '/setup') {
          $scope.settingsWatchOff();
          return;
        }

        var key;
        if (typeof oldVal === 'undefined') {
          for (key in newVal) {
            if (newVal[key] === true) {
              $scope.setLoginSettingsToLevel(key);
            }
          }
          return;
        }

        var onKey;
        for (key in newVal) {
          if (newVal[key] === true && (typeof oldVal[key] === 'undefined' || !oldVal[key])) {
            onKey = key;
            break;
          }
        }

        if (onKey) {
          for (key in newVal) {
            if (newVal[key] && key !== onKey) {
              newVal[key] = false;
            }
          }

          $scope.setLoginSettingsToLevel(onKey);
        }
      }, true);

      $rootScope.$emit('pageLoaded');
      adobeService.trackState('settings', analyticConstants.SETTINGS_SECTION);

      if (!$rootScope.language) {
        $scope.setLanguage().then(function() {
          $scope.getLocale();
        });
      }
      else {
        $scope.getLocale();
      }
    }
  ]);
}());
