/**
 * Service for logging members in.
 *
 * @namespace Services
 * @class loginService
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.login', [])
    .service('loginService', [
      '$q',
      '$rootScope',
      '$http',
      'config',
      'storageService',
      function($q, $rootScope, $http, config, storageService) {
        var userLoggedOutFlag = false;
        var loginUrl = config.loginUrl || 'https://mobileps.bcbsnc.com/mga/sps/oauth/oauth20/token';
        this.setUserLoggedOutFlag = function(boolVal) {
          userLoggedOutFlag = boolVal;
        };
        this.getUserLoggedOutFlag = function() {
          return userLoggedOutFlag;
        };
        this.getUserId = function() {
          return this
            .getAuthorization()
            .then(function(authValue) {
              if (!authValue) {
                return null;
              }
              return authValue.userId;
            });
        };
        this.setBiometricEnabled = function(bioBoolean) {
          if (typeof bioBoolean !== 'boolean') {
            console.warn('Attempted to set a non-boolean as biometricEnabled', bioBoolean);
            return $q.reject('setting biometric boolean no es available');
          }
          return storageService.set('biometricEnabled', {biometricEnabled: bioBoolean});
        };
        this.getBiometricEnabled = function() {
          return storageService
            .get('biometricEnabled')
            .then(function(biometricObject) {
              if (biometricObject && biometricObject.biometricEnabled) {
                return biometricObject.biometricEnabled;
              }
              return false;
            })
            .catch(function(retrievalError) {
              console.warn('Error fetching biometric boolean', retrievalError);
            });
        };
        this.setAuthorization = function(newAuthObj) {
          return storageService.set('authorization', newAuthObj);
        };
        this.getAuthorization = function() {
          return storageService
            .get('authorization')
            .catch(function(retrievalError) {
              console.warn('Error getting authorization value', retrievalError);
            });
        };
        this.clearAuthorization = function() {
          return storageService.set('authorization', null);
        };

        /**
         * @description Attempts to log in with ISAM.
         * @memberof loginService
         * @method attemptLogin
         */
        this.attemptLogin = function(userId, password, clientId, clientSecret) {
          var self = this;
          return $q(function(resolve, reject) {
            $http.defaults.headers.common['Authorization'] = null;

            if (typeof cordova !== 'undefined') {
              window.cookies.clear(function() {
                $http({
                  method: 'POST',
                  url: loginUrl,
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: encodeForm,
                  data: {
                    grant_type: 'password',
                    client_id: clientId,
                    client_secret: clientSecret,
                    username: userId,
                    password: password
                  }
                })
                  .success(function(result) {
                    $http.defaults.headers.common = {
                      'Authorization': 'Bearer ' + result.access_token
                    };
                    var authorization = {
                      accessToken: result.access_token,
                      refreshToken: result.refresh_token,
                      expires: self.getTokenExpiryDate(result.expires_in),
                      logInDate: new Date()
                    };
                    // TODO: use login settings to determine whether to save userId.
                    authorization.userId = userId;
                    resolve(authorization);
                  })
                  .error(function(error) {
                    console.log(error);
                    reject(error);
                  });
              });
            }
          });
        };

        /**
         * @description Attempts to refresh the session with ISAM.
         * @memberof loginService
         * @method attemptLogin
         */
        this.attemptRefreshLogin = function(authorization, clientId, clientSecret) {
          var self = this;
          return $q(function(resolve, reject) {
            $http.defaults.headers.common['Authorization'] = null;

            if (typeof cordova !== 'undefined') {
              window.cookies.clear(function() {
                $http({
                  method: 'POST',
                  url: loginUrl,
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: encodeForm,
                  data: {
                    grant_type: 'refresh_token',
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: authorization.refreshToken
                  }
                })
                  .success(function(result) {
                    $http.defaults.headers.common = {
                      'Authorization': 'Bearer ' + result.access_token
                    };

                    var newAuthorization = {
                      accessToken: result.access_token,
                      refreshToken: result.refresh_token,
                      expires: self.getTokenExpiryDate(result.expires_in),
                      logInDate: authorization.logInDate,
                      userId: authorization.userId
                    };
                    resolve(newAuthorization);
                  })
                  .error(reject);
              });
            }
          });
        };

        /**
         * @description Returns the date that the current token will expire.
         * @memberof loginService
         * @method getTokenExpiryDate
         * @param  {Number} expiresSeconds The number in seconds that the token will expire.
         * @return {Date} The date of expiration.
         */
        this.getTokenExpiryDate = function(expiresSeconds) {
          var now = new Date();
          return moment(now.getTime() + expiresSeconds * 1000).toDate();
        };

        /**
         * @description Decrypts OAuth credentials.
         * @memberof loginService
         * @method getDecryptedCredentials
         * @param  {Object} credentials The encrypted credentials.
         * @return {Object} The decrypted credentials.
         */
        this.getDecryptedCredentials = function(credentials) {
          return {
            clientId: CryptoJS.AES.decrypt(credentials.clientId, config.key).toString(CryptoJS.enc.Utf8),
            clientSecret: CryptoJS.AES.decrypt(credentials.clientSecret, config.key).toString(CryptoJS.enc.Utf8)
          };
        };

        /**
          * @description Encrypts OAuth credentials.
          * @memberof loginService
          * @method getEncryptedCredentials
          * @return {Object} The encrypted credentials.
          */
        this.getEncryptedCredentials = function(credentials) {
          return {
            clientId: CryptoJS.AES.encrypt(credentials.clientId, config.key).toString(),
            clientSecret: CryptoJS.AES.encrypt(credentials.clientSecret, config.key).toString()
          };
        };

        /**
         * @description Returns whether a member is currently logged in.
         * @memberof loginService
         * @method isLoggedIn
         * @return {Boolean} Whether a member is logged in.
         */
        this.isLoggedIn = function() {
          if ($rootScope.appSettings && $rootScope.appSettings.authorization) {
            if (typeof $rootScope.appSettings.authorization.expires === 'string') {
              $rootScope.appSettings.authorization.expires = moment($rootScope.appSettings.authorization.expires).toDate();
            }
            var now = new Date();
            return $rootScope.appSettings.authorization.expires <= now;
          }

          return false;
        };

        function encodeForm(obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
          return str.join('&');
        }
      }
    ]);
}());
