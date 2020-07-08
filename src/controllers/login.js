/**
 * Controller for the login page view.
 *
 * @namespace Controllers
 * @class LoginController
 */
(function () {
  'use strict';

  angular
    .module('blueconnect.mobile.controllers.login', [
      'blueconnect.mobile.services.touchId',
    ])
    .controller('LoginController', [
      '$scope',
      '$rootScope',
      '$http',
      '$q',
      'languageService',
      'loginService',
      'cordovaService',
      'touchIdService',
      'adobeService',
      'analyticConstants',
      'config',
      'alertService',
      'CacheFactory',
      'restService',
      function (
        $scope,
        $rootScope,
        $http,
        $q,
        languageService,
        loginService,
        cordovaService,
        touchIdService,
        adobeService,
        analyticConstants,
        config,
        alertService,
        CacheFactory,
        restService
      ) {
        // calls closeAlert method if any alert modal is present before displaying login page
        alertService.closeAlert();

        $rootScope.showNav = false;
        $rootScope.showPolicySelect = false;
        $rootScope.loggedIn = false;

        restService
          .getData('login', $rootScope.language || 'en', { loggedIn: false })
          .then(function (result) {
            $scope.messageEods = result.messageEods;
            $scope.messageDate = result.messageDate;
            if (result.messageEods === 1) {
              $rootScope.logOut();
            }
          });

        $rootScope.$on('languageChanged', function () {
          $scope.loc = languageService.getInternalLocale($rootScope.language);
        });

        $rootScope.startingView = analyticConstants.LOGIN_SECTION;
        adobeService.trackState('login', analyticConstants.LOGIN_SECTION);

        var clientId = null;
        var clientSecret = null;

        var tphSourceSytem = 'BCBSNCMbrPrtlLgn';

        var deviceType = cordovaService.checkDeviceType();

        $scope.biometric = {
          isAndroid: deviceType.android,
          isAvailable: null,
          desireToEnroll: null,
          alreadyEnrolled: null,
          faceId: deviceType.android ? false : null,
          biometricType: null,
          enableText: null,
        };

        if ($rootScope.loc && numberOfKeys($rootScope.loc) > 0) {
          $scope.loc = $rootScope.loc;
        }

        if (
          !$rootScope.language ||
          !$scope.loc ||
          numberOfKeys($scope.loc) === 0
        ) {
          $scope.loc = languageService.getInternalLocale();
          $scope.biometric.biometricType = deviceType.android
            ? 'FINGERPRINT_AUTH'
            : 'SETTINGS_LOGIN_KEY_TOUCH_ID';
          $scope.biometric.enableText = deviceType.android
            ? 'ENABLE_FINGERPRINT_AUTH'
            : 'ENABLE_TOUCH_ID';
          setupCredentials();
          $rootScope.setLanguage(languageService.getDefaultLanguage());
        }

        // if we're on the login page but not using the internal locale
        if (
          numberOfKeys($scope.loc) !==
          numberOfKeys(languageService.getInternalLocale())
        ) {
          $scope.loc = languageService.getInternalLocale();
        }

        document.addEventListener('offline', function () {
          $scope.$apply(function () {
            $scope.password = '';
          });
        });

        $scope.password = '';
        $scope.userId = null;
        var previousUserId = null;

        loginService
          .getUserId()
          .then(function (userId) {
            if (!userId) {
              $scope.biometric.alreadyEnrolled = false;
            }
            previousUserId = userId;
            if (previousUserId) {
              $scope.userId = previousUserId;
            }

            return touchIdService.isAvailable();
          })
          .then(function (result) {
            if (!result) {
              $scope.biometric.isAvailable = false;
              return false;
            }

            $scope.biometric.isAvailable = true;

            if (result === 'face') {
              $scope.biometric.faceId = true;
              $scope.biometric.biometricType = 'SETTINGS_LOGIN_KEY_FACE_ID';
              $scope.biometric.enableText = 'ENABLE_FACE_ID';
            } else {
              if (!$scope.biometric.enableText) {
                $scope.biometric.enableText = deviceType.android
                  ? 'ENABLE_FINGERPRINT_AUTH'
                  : 'ENABLE_TOUCH_ID';
              }
              if (!$scope.biometric.biometricType) {
                $scope.biometric.biometricType = deviceType.android
                  ? 'FINGERPRINT_AUTH'
                  : 'SETTINGS_LOGIN_KEY_TOUCH_ID';
              }
            }

            if (result === 'touch') {
              $scope.biometric.faceId = false;
            }

            return loginService.getBiometricEnabled();
          })
          .then(function (bioBoolean) {
            // eslint-disable-next-line no-undefined
            if (bioBoolean === null || bioBoolean === undefined) {
              console.warn(
                'Biometric bool is falsy, but not false, setting it to strictly false'
              );
              bioBoolean = false;
            }

            $scope.biometric.alreadyEnrolled = bioBoolean;
            if (bioBoolean === false) {
              $scope.biometric.desireToEnroll = bioBoolean;
            }

            if (bioBoolean === true && !$scope.userId) {
              $scope.biometric.alreadyEnrolled = false;
              $scope.biometric.desireToEnroll = true;
              return console.warn(
                'Had to leave auto-sign-in early due to mismatch in auth settings'
              );
            }
            if (
              bioBoolean === true &&
              loginService.getUserLoggedOutFlag() === false
            ) {
              return $scope.loginWithBiometric();
            }
          })
          .catch(function (loginPreferencesError) {
            console.error('Had an error in pre-login', loginPreferencesError);
            if (loginPreferencesError.code === -7) {
              console.log('no fingerprints enrolled');
              $scope.biometric.isAvailable = false;
              $scope.biometric.desireToEnroll = false;
            }
            $scope.biometric.alreadyEnrolled = false;
          });

        $scope.userIdChangedFromPrevious = function (newUserId) {
          if (!previousUserId) {
            return false;
          }
          console.log('Comparing %s to %s', previousUserId, newUserId);
          return previousUserId !== newUserId;
        };

        $scope.toggleBiometricDesireToEnroll = function () {
          $scope.biometric.desireToEnroll = !$scope.biometric.desireToEnroll;
        };

        /**
         * @description Kicks off the login process.
         * @memberof LoginController
         * @method logIn
         */
        $scope.logIn = function () {
          $scope.loginAttempted = true;

          $rootScope.credentials = loginService.getEncryptedCredentials({
            clientId: $scope.userId,
            clientSecret: $scope.password,
          });

          if (!$scope.loginForm.$valid) {
            $scope.password = '';
            $scope.loginFailed = true;
            $scope.loginInvalidMessage = $scope.loc.LOGIN_INVALID;
            if ($scope.loginForm.$error.required) {
              var fieldName = $scope.loginForm.userId.$error.required
                ? 'username'
                : 'password';
              $scope.trackLoginAction(false, 'Missing ' + fieldName + '.');
            }
            return;
          }

          $scope.hideKeyboard();
          $scope.loginInvalidMessage = null;

          $rootScope.$emit('pageLoading');

          if (
            $scope.biometric.alreadyEnrolled === true &&
            $scope.userIdChangedFromPrevious() === false
          ) {
            return $scope.loginWithBiometric();
          }

          console.log('biometric enabled %s', $scope.biometric.desireToEnroll);
          return ($scope.biometric.desireToEnroll
            ? touchIdService.isAvailable().then(function (biometric) {
                console.log(biometric);
                return touchIdService.verifyFingerprint(
                  'Sign into your Member Profile'
                );
              })
            : $q.resolve(false)
          )
            .then(function () {
              loginService.setBiometricEnabled(
                !!$scope.biometric.desireToEnroll
              );

              if (!clientId || !clientSecret) {
                console.log('setting up credentials for the re-log in');
                setupCredentials();
              }

              return loginService.attemptLogin(
                $scope.userId,
                $scope.password,
                clientId,
                clientSecret
              );
            })
            .then(function (authorization) {
              $scope.loginFailed = false;
              $rootScope.loggedIn = true;

              var cache = CacheFactory.get('defaultCache'); //defined in AngularJS-Services-Cloud
              if (cache) {
                CacheFactory.clearAll();
              }
              if (
                $scope.biometric.alreadyEnrolled ||
                $scope.biometric.desireToEnroll
              ) {
                authorization.rememberUserId = true;
              }
              loginService.setAuthorization(authorization);
              $scope.trackLoginAction(true);
              loadNextPage();
            })
            .catch(function (error) {
              console.warn('Error in biometric', error);
              loginService.setBiometricEnabled(false);
              $scope.trackLoginAction(false, 'Biometrics error.');
              $rootScope.$emit('pageLoaded');
              $scope.loginFailed = true;
              $scope.loginInvalidMessage = $scope.loc.LOGIN_INVALID;
              $scope.password = '';
              $scope.tphLoginFail();
            });
        };

        $scope.trackLoginAction = function (successful, reason) {
          if (successful) {
            adobeService.trackAction(
              'loginSuccessfulLogin',
              analyticConstants.LOGIN_SECTION,
              { biometrics: $scope.biometric }
            );
            $rootScope.elapsedTimeNeeded = true;
            $rootScope.timeElapsed = Date.now();
          } else {
            adobeService.trackAction(
              'loginFailedLogin',
              analyticConstants.LOGIN_SECTION,
              { reason: reason }
            );
          }
        };

        $scope.attemptTestLogin = function () {
          if (config.env === 'LOCAL') {
            $rootScope.loggedIn = true;
            $scope.trackLoginAction(true);
            loadNextPage();
          }
        };

        $scope.loginWithBiometric = function () {
          if (!clientId || !clientSecret) {
            console.log('setting up credentials for the re-log in');
            setupCredentials();
          }
          $rootScope.$emit('pageLoading');
          touchIdService
            .isAvailable()
            .then(function () {
              return touchIdService.verifyFingerprint(
                'Sign into your Member Profile'
              );
            })
            .then(function () {
              return loginService.getAuthorization();
            })
            .then(function (authorization) {
              return loginService.attemptRefreshLogin(
                authorization,
                clientId,
                clientSecret
              );
            })
            .then(function (newAuthObj) {
              newAuthObj.rememberUserId = true;
              loginService.setAuthorization(newAuthObj);
              $rootScope.loggedIn = true;
              //  $scope.trackLoginAction(true);
              loadNextPage();
            })
            .catch(function () {
              $rootScope.$emit('pageLoaded');
            });
        };

        /**
         * Retrieves locale and sends the user to the next page.
         *
         * @memberof LoginController
         * @method loadNextPage
         */
        function loadNextPage() {
          $rootScope.getLocale().then(function () {
            $scope.getPolicies().then(
              function () {
                // Make request to touch point.
                $http.post(config.apiUrl + '/touch-point', {
                  policyindex: $rootScope.policyIndex,
                  originatingUrl: '/login',
                  lobCode: $rootScope.selectedPolicy.lobCode,
                  groupId: $rootScope.selectedPolicy.groupNumber,
                  pageTph: tphSourceSytem,
                  policyMemberId:
                    $rootScope.selectedPolicy.alphaPrefix +
                    $rootScope.selectedPolicy.externalId,
                });

                $scope.getNavbar();

                $scope.saveLoginSettings();

                // Go to homepage.
                $rootScope.gotoView('/home');
              },
              function () {
                alertService.showAlert(
                  $scope.loc.NETWORK_ERROR,
                  $scope.loc.NETWORK_ERROR_MESSAGE,
                  { title: $scope.loc.OK, color: 'blue' }
                );
                $scope.password = '';
                $scope.trackLoginAction(false, 'Network error.');
                $scope.tphLoginFail();
                $rootScope.$emit('pageLoaded');
              }
            );
          });
          $scope.getSignature();
        } // end loadnext page

        /**
         * @description Sets up app credentials for login.
         * @memberof LoginController
         * @method setupCredentials
         */
        function setupCredentials() {
          if (!clientId || !clientSecret) {
            var credentials = loginService.getDecryptedCredentials(
              config.credentials
            );
            clientId = credentials.clientId;
            clientSecret = credentials.clientSecret;
          }
        }

        $scope.gotoForgotUsername = function () {
          return $rootScope.openInBrowser(
            config.bcbsWebUrl + '/members/public/register/forgotusername.htm'
          );
        };

        $scope.gotoForgotPassword = function () {
          return $rootScope.openInBrowser(
            config.bcbsWebUrl +
              '/members/public/register/forgotpassword.htm?closeOnComplete=true'
          );
        };

        $scope.gotoRegistration = function () {
          // return $rootScope.openInBrowser(config.bcbsWebUrl+'/members/public/register');
          $rootScope.gotoView('/registration');
        };

        /**
         * @description TPH login fail
         * @memberof LoginController
         * @method tphLoginFail
         */
        $scope.tphLoginFail = function () {
          // TPH Logging - unsuccessfull login
          const data = {
            pageTph: tphSourceSytem,
            errorCode: '401',
            errorDescription: 'Failed Login',
            originatingUrl: '/login',
          };
          // Hit touchpoint
          $http.post(config.apiUrl + '/touch-point', data);
        };

        /**
         * @description Saves the login settings.
         * @memberof SetupController
         * @method saveLoginSettings
         */
        $scope.saveLoginSettings = function () {
          if (!$rootScope.appSettings) {
            $rootScope.appSettings = {};
          }

          var loginSettings = {
            rememberUserId:
              ($rootScope.appSettings.login &&
                $rootScope.appSettings.login.useTouchId) ||
              false,
            useTouchId:
              ($rootScope.appSettings.login &&
                $rootScope.appSettings.login.useTouchId) ||
              false,
          };

          $rootScope.appSettings.login = loginSettings;
        };

        function numberOfKeys(obj) {
          if (typeof obj !== 'object') {
            console.warn('Tried to get number of keys for non-object', obj);
            return 0;
          }

          return Object.keys(obj).length;
        }
      },
    ]);
})();
