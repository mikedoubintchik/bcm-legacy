/**
 * Service for communication with Apple's TouchID SDK.
 *
 * @namespace Services
 * @class touchIdService
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.touchId', [])
    .factory('touchIdService', [
      '$q',
      '$window',
      '$rootScope',
      'analyticConstants',
      'adobeService',
      'cordovaService',
      function($q, $window, $rootScope, analyticConstants, adobeService, cordovaService) {
        if (isUndefined($window.cordova)) {
          document.addEventListener('deviceready', function() {
            cordova.addConstructor(install);
          });
        }

        var deviceType = cordovaService.checkDeviceType();
        var androidFingerprintObject = {
          clientId: 'bcm',
          username: 'defaultUser',
          password: 'x(L>JKY5Y8_Sbz'
        };

        return {
          install: install,
          isAvailable: isAvailable,
          verifyFingerprint: verifyFingerprint,
          verifyFingerprintWithCustomPasswordFallback: verifyFingerprintWithCustomPasswordFallback,
          verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel: verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel,
        };

        /**
        * Returns a promise containing whether TouchID is available.
        *
        * @memberof touchIdService
        * @method isAvailable
        * @return {Promise} A promise that resolves to function(isAvailable).
        */
        function isAvailable() {
          return $q(function(resolve, reject) {
            if (typeof cordova === 'undefined') {
              return reject('Cordova base framework not present.');
            }

            if (touchIdPluginUnavailable()) {
              return reject('Cordova touchId plugin not present.');
            }

            if (deviceType.android === true) {
              return FingerprintAuth.isAvailable(
                function(result) {
                  if (!result || !result.isAvailable) {
                    return reject('Unable to get result from Android Cordova fingerprint plugin');
                  }
                  resolve(result.isAvailable);
                  adobeService.trackAction('settings:update:touchIdOn', analyticConstants.SETTINGS_SECTION);
                },
                reject
              );
            } else {
              return $window.plugins.touchid.isAvailable(resolve, reject);
            }

          });
        }

        /**
        * Opens the verify fingerprint modal with a message.
        *
        * @memberof touchIdService
        * @method verifyFingerprint
        * @param  {String} message The message to display in the modal.
        * @return {Promise} A promise that resolves to function(), when fingerprint authentication was successful.
        */
        function verifyFingerprint(message) {
          return $q(function(resolve, reject) {
            if (typeof cordova === 'undefined') {
              return reject('Cordova library not present.');
            }

            if (touchIdPluginUnavailable()) {
              return reject('Cordova library not present.');
            }

            message = message || $rootScope.loc.CONFIRM_FINGERPRINT;
            if (deviceType.android === true) {
              return FingerprintAuth.encrypt(androidFingerprintObject, resolve, reject);
            } else {
              return $window.plugins.touchid.verifyFingerprint(message, resolve, reject);
            }
          });
        }

        /**
        * Opens the verify fingerprint or password modal with a message.
        *
        * @memberof touchIdService
        * @method verifyFingerprintWithCustomPasswordFallback
        * @param  {String} message The message to display in the modal.
        * @return {Promise} A promise that resolves to function(), when fingerprint authentication was successful.
        */
        function verifyFingerprintWithCustomPasswordFallback(message) {
          return $q(function(resolve, reject) {
            if (typeof cordova === 'undefined') {
              return reject('Cordova library not present.');
            }

            if (touchIdPluginUnavailable()) {
              return reject('Cordova library not present.');
            }

            message = message || $rootScope.loc.CONFIRM_FINGERPRINT;

            if (deviceType.android === true) {
              return FingerprintAuth.encrypt(androidFingerprintObject, resolve, reject);
            } else {
              return $window.plugins.touchid
                .verifyFingerprintWithCustomPasswordFallback(message, resolve, reject);
            }
          });
        }

        /**
        * Opens the verify fingerprint or password modal with a message and custom input label.
        *
        * @memberof touchIdService
        * @method verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel
        * @param  {String} message The message to display in the modal.
        * @param  {String} label   The text of the custom label.
        * @return {Promise} A promise that resolves to function(), when fingerprint authentication was successful.
        */
        function verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(message, label) {
          return $q(function(resolve, reject) {
            if (typeof cordova === 'undefined') {
              return reject('Cordova library not present.');
            }

            if (touchIdPluginUnavailable()) {
              return reject('Cordova library not present.');
            }

            message = message || $rootScope.loc.CONFIRM_FINGERPRINT;
            label = label || '';
            if (deviceType.android === true) {
              return FingerprintAuth.encrypt(androidFingerprintObject, resolve, reject);
            } else {
              return $window.plugins.touchid
                .verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(message, label, resolve, reject);
            }
          });
        }

        function install() {
          return this;
        }

        function touchIdPluginUnavailable() {
          return touchIdPluginAvailable() == false;
        }

        function touchIdPluginAvailable() {
          return isDefined($window.plugins) && isDefined($window.plugins.touchid);
        }

        function isDefined(potentialVal) {
          return isUndefined(potentialVal) === false;
        }

        function isUndefined(potentialVal) {
          return typeof potentialVal === 'undefined';
        }
      }
    ]);
}());