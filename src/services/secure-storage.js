/**
 * Service for encrypted local storage on mobile devices.
 *
 * @namespace Services
 * @class storageService
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.storage', [])
    .service('storageService', [
      '$q',
      'config',
      function($q, config) {

        /**
        * Retrieves a stored object.
        *
        * @memberof storageService
        * @method get
        * @param  {String} key The unique ID the object is stored under.
        * @return {Promise} A promise that resolves to function(storedObject).
        */
        this.get = function(key) {
          return $q(function(resolve, reject) {
            if (typeof cordova === 'undefined') {
              return reject('Cordova library not present.');
            }

            if (typeof NativeStorage === 'undefined') {
              return reject('Storage plugin unavailable.');
            }


            NativeStorage.getItem(key, function(encryptedValue) {
              var decryptedValue = CryptoJS.AES.decrypt(encryptedValue, config.key).toString(CryptoJS.enc.Utf8);
              var value = JSON.parse(decryptedValue);
              console.log(key, value);
              if (typeof value !== 'string') {
                return resolve(value);
              }

              try {
                var objectValue = JSON.parse(value);
                resolve(objectValue);
              }
              catch(error) {
                console.warn('Error in native storage getting key %s', key, error);
                resolve(value);
              }
            },reject);
          });

        };

        /**
        * Stores an object.
        *
        * @memberof storageService
        * @method set
        * @param  {String} key   The unique ID to store the object under
        * @param  {Object} value The value to store.
        * @return {Promise} A promise that resolves to function().
        */
        this.set = function(key, value) {
          return $q(function(resolve, reject) {
            if (typeof cordova === 'undefined') {
              return reject('Cordova library not present.');
            }

            if (typeof NativeStorage === 'undefined') {
              return reject('Storage plugin unavailable.');
            }

            if (typeof value === 'object') {
              value = JSON.stringify(value);
            }
            console.log('Attempting to set object %s:', key, value);
            try {
              var encryptedValue = CryptoJS.AES.encrypt(value, config.key).toString();
              NativeStorage.setItem(key, encryptedValue, resolve, reject);
            } catch(error) {
              console.warn('Error setting app setting %s', key, value);
              reject(error);
            }
          });
        };

        /**
        * Removes a stored object.
        *
        * @memberof storageService
        * @method remove
        * @param  {String} key The unique ID the object is stored under.
        * @return {Promise} A promise that resolves to function().
        */
        this.remove = function(key) {
          return $q(function(resolve, reject) {
            if (typeof cordova === 'undefined') {
              return reject('Cordova library not present.');
            }

            if (typeof NativeStorage === 'undefined') {
              return reject('Storage plugin unavailable.');
            }

            NativeStorage.remove(key, resolve, reject);
          });
        };
      }
    ]);
}());
