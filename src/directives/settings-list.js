/**
 * Directive for the application settings page.
 *
 * @namespace Directives
 * @class settings
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.directives.settingsList', [])
    .directive('settingsList', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/settings-list.html',
        scope: {
          /**
           * The settings information to display.
           *
           * @memberof settings
           * @member {Object} data
           */
          settingsData: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          '$route',
          '$window',
          '$q',
          'cordovaService',
          'restService',
          'languageService',
          'loginService',
          'touchIdService',
          'adobeService',
          'analyticConstants',
          function(
            $scope,
            $rootScope,
            $route,
            $window,
            $q,
            cordovaService,
            restService,
            languageService,
            loginService,
            touchIdService,
            adobeService,
            analyticConstants
          ) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.language = $rootScope.language;

            $scope.loginSettings = {
              touchIdAvailable: null,
              biometricEnabled: null,
              faceId: null
            };
            $scope.settingData = $scope.settingsData; //I could not use $scope.settingsData in template because it was not being updated.

            touchIdService
              .isAvailable()
              .then(function(result) {
                $scope.loginSettings.touchIdAvailable = true;
                $scope.loginSettings.faceId = result === 'face';
                return loginService.getBiometricEnabled();
              })
              .then(function(bioBoolean) {
                $scope.loginSettings.biometricEnabled = bioBoolean;

                // Set display text.
                updateTouchIdMessage($scope.loginSettings.biometricEnabled);
              })
              .catch(function() {
                $scope.loginSettings.touchIdAvailable = false;
              });

            for (var setting in $scope.settingsData) {
              var currentSetting = $scope.settingsData[setting].settings;
              for (var key in currentSetting) {
                // eslint-disable-next-line no-undefined
                if ($rootScope.appSettings[setting] !== undefined) {
                  if ($rootScope.appSettings[setting].hasOwnProperty(key)) {
                    $scope.settingsData[setting].settings[key].value =
                      $rootScope.appSettings[setting][key];
                  }
                }
              }
            }



            /* setting device type for setting list if statement */
            var deviceResult = cordovaService.checkDeviceType();
            $scope.iphone = deviceResult.ios;
            $scope.android = deviceResult.android;

            // Set display text based on current scope.
            function updateTouchIdMessage(useTouchId) {
              if ($scope.android === true) {
                $scope.touchIdDisplayText = useTouchId === false ?
                $rootScope.loc.ENABLE_FINGERPRINT_AUTH:
                $rootScope.loc.DISABLE_FINGERPRINT_AUTH;
              } else {
                if ($scope.loginSettings.faceId === true) {
                  $scope.touchIdDisplayText = useTouchId === false ?
                  $rootScope.loc.ENABLE_FACE_ID:
                  $rootScope.loc.DISABLE_FACE_ID;
                } else {
                  $scope.touchIdDisplayText = useTouchId === false ?
                  $rootScope.loc.ENABLE_TOUCH_ID:
                  $rootScope.loc.DISABLE_TOUCH_ID;
                }
              }
            }

            /**
             * Allows the user to select the language used by the application.
             *
             * @memberof settings
             * @method toggleLanguage
             * @param  {String} languageToBe The selected language to make active on the screen by user.
             */
            $scope.toggleLanguage = function(languageToBe) {
              $rootScope.setLanguage(languageToBe);
              $scope.language = languageToBe;

              languageService
                .getLocale(languageToBe)
                .then(function(locale) {
                  $rootScope.loc = locale;
                  $scope.loc = $rootScope.loc;
                  return $scope.getPolicies($rootScope.policyIndex);
                })
                .then(function(policies) {
                  $rootScope.policies = policies;
                  $rootScope.refreshNavbar();
                  $route.reload();
                  return $scope.loc;
                });
            };

            /**
             * Retrieves the member's policies from the data service.
             *
             * @memberof settings
             * @method getPolicies
             */
            $scope.getPolicies = function(policyToSelect) {
              var deferred = $q.defer();
              restService.getData('policies', $rootScope.language || 'en').then(function(policies) {
                $rootScope.policies = policies;
                $rootScope.selectPolicy(policyToSelect);
                deferred.resolve(policies);
              });

              return deferred.promise;
            };

            /**
             * opens the external link to reset the password.
             *
             * @memberof settings
             * @method gotoResetPassword
             */

            $scope.gotoResetPassword = function() {
              return $rootScope.openInBrowser($scope.settingsData.login.settings.link);
            };

            /**
             * Submits the settings form and saves data to local database and rootscope.
             *
             * @memberof settings
             * @method saveSettings
             * @param  {Object} formData The settings data to be saved on the device.
             */
            $scope.saveSettings = function(formData) {
              for (var category in formData) {
                //Category is login, pushNotifications, etc..
                var settings = { data: [] };

                var currentSetting = formData[category].settings; //currentSetting is the full key/value pairs for a category
                for (var key in currentSetting) {
                  //key is the individual fields in a specific category
                  var setting = { key: key, value: formData[category].settings[key].value };
                  settings.data.push(setting);

                  $rootScope.appSettings[category][key] = setting.value;
                }

                cordovaService.updateAppSettings(category, settings);
              }

              $window.history.back();
            };

            /**
             * Toggles the touch ID value on/off. It sets the value and switches the button text.
             *
             * @memberof settings
             * @method onToggleTouchId
             * @param  {Boolean} useTouchId
             */
            $scope.onToggleTouchId = function() {
              return (
                $scope.loginSettings.biometricEnabled === false ?
                touchIdService
                  .isAvailable()
                  .then(function(biometric) {
                    console.log(biometric);
                    return touchIdService.verifyFingerprint('Sign into your Member Profile');
                  }) :
                  $q.resolve(false)
              )
              .then(function() {
                return loginService.setBiometricEnabled(!$scope.loginSettings.biometricEnabled);
              })
              .then(function(bioBoolean) {
                console.log(bioBoolean);
                adobeService.trackAction('settings:update:biometrics:' + bioBoolean ? 'on' : 'off', analyticConstants.SETTINGS_SECTION);
                return loginService.getBiometricEnabled();
              })
              .then(function(bioBooleanFromAppSettings) {
                $scope.loginSettings.biometricEnabled = bioBooleanFromAppSettings;
                // Update message.
                updateTouchIdMessage($scope.loginSettings.biometricEnabled);
              })
              .catch(function(setBioBooleanError) {
                console.warn('Error setting biometric boolean', setBioBooleanError);
                loginService
                  .getBiometricEnabled()
                  .then(function(bioBooleanToRevert) {
                    $scope.loginSettings.biometricEnabled = bioBooleanToRevert;
                  });
              });
            };
          },
        ],
      };
    },
  ]);
})();
