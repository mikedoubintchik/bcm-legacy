/**
 * The main controller of the application.
 *
 * @namespace Controllers
 * @class MainController
 */
(function () {
  'use strict';

  angular
    .module('blueconnect.mobile.controllers.main', [
      'bcbsnc.cloud.services.component',
      'bcbsnc.cloud.services.rest',
    ])
    .controller('MainController', [
      '$scope',
      '$rootScope',
      '$location',
      '$q',
      '$http',
      'config',
      'cordovaService',
      'languageService',
      'componentService',
      'restService',
      'alertService',
      'adobeService',
      'PaymentFlowFactory',
      'CacheFactory',
      'TransparencyFactory',
      'backButtonService',
      'loginService',
      'analyticConstants',
      'googleMapsService',
      function (
        $scope,
        $rootScope,
        $location,
        $q,
        $http,
        config,
        cordovaService,
        languageService,
        componentService,
        restService,
        alertService,
        adobeService,
        PaymentFlowFactory,
        CacheFactory,
        TransparencyFactory,
        backButtonService,
        loginService,
        analyticConstants,
        googleMapsService
      ) {
        // load Google Maps Api
        $rootScope.mapsReady = false;
        if (window.google && google.maps) {
          $rootScope.mapsReady = true;
        } else {
          googleMapsService.getGoogleMapsApi();
        }
        backButtonService.backButtonFunction();
        angular.element('.page-no-connection').hide();
        /**
         * ($rootScope) Toggles display of the navbar. Set by individual views, on load.
         *
         * @memberof MainController
         * @member {Boolean} showNav
         */
        $rootScope.showNav = false;
        $rootScope.loggedIn = false;

        // intializing live chat

        $rootScope.livechat = { value: false };

        /**
         * ($rootScope) Button types for the left side of the navbar
         *
         * @memberof MainController
         * @member {Object} leftNavButtonType
         */
        $rootScope.leftNavButtonType = {
          HOME: 'HOME',
          HELP: 'HELP',
          BACK: 'BACK',
          INBOX: 'INBOX',
          BACK_TO_BILLING: 'BACK_TO_BILLING',
        };

        /**
         * ($rootScope) Display setting for the left navbar button.
         *
         * @memberof MainController
         * @member {String} leftNavButton
         */
        $rootScope.leftNavButton = $rootScope.leftNavButtonType.HELP;

        /**
         * ($rootScope) The page title content of the navbar. Can be text or an image.
         *
         * @memberof MainController
         * @member {Object} pageTitle
         */
        $rootScope.pageTitle = null;

        /**
         * ($rootScope) Toggles display of the policy select element. Set by individual views, on load.
         *
         * @memberof MainController
         * @member {Boolean} showPolicySelect
         */
        $rootScope.showPolicySelect = false;

        /**
         * ($rootScope) The currently selected policy index.
         *
         * @memberof MainController
         * @member {Number} policyIndex
         */
        $rootScope.policyIndex = 0;

        /**
         * ($rootScope) The member's policies, loaded from the data service.
         *
         * @memberof MainController
         * @member {Array} policies
         */
        $rootScope.policies = null;

        $rootScope.selectedPolicy = null;

        $rootScope.getSelectedPolicy = function () {
          return $rootScope.selectedPolicy;
        };

        /**
         * ($rootScope) Wrapper around local method so to expose to other directives.
         *
         * @memberof MainController
         */
        $rootScope.refreshNavbar = function () {
          $scope.getNavbar();
        };

        // Show page load spinner
        $rootScope.$on('pageLoading', function () {
          angular.element('.page-loading-spinner').show();
        });

        // Hide page load spinner
        $rootScope.$on('pageLoaded', function () {
          angular.element('.page-loading-spinner').hide();
        });

        /**
         * ($rootScope) Displays a network connection error alert.
         *
         * @memberof MainController
         * @method showNetworkErrorAlert
         */
        $rootScope.showNetworkErrorAlert = function () {
          if (!$rootScope.loc) {
            $rootScope.getInternalLocale();
          }

          var okTitle = $rootScope.loc.HOME_PAGE;
          if ($location.url() === '/home') {
            okTitle = $rootScope.loc.RETRY;
          }
          alertService
            .showAlert(
              $rootScope.loc.NETWORK_ERROR,
              $rootScope.loc.SERVICE_ERROR_MESSAGE,
              { title: $rootScope.loc.LOG_OUT, color: 'red' },
              { title: okTitle, color: 'blue' }
            )
            .then(
              function () {
                $rootScope.gotoView('/logout');
              },
              function () {
                if ($location.url() === '/home') {
                  $rootScope.gotoView('/home-refresh');
                  return;
                }
                $rootScope.gotoView('/home');
              }
            );
        };

        /**
         * ($rootScope) Displays a network connection error alert for unauthenticated pages.
         *
         * @memberof MainController
         * @method showNetworkErrorUnautenticated
         */
        $rootScope.showNetworkErrorUnautenticated = function () {
          if (!$rootScope.loc) {
            $rootScope.getInternalLocale();
          }

          var okTitle = $rootScope.loc.OK;
          alertService
            .showAlert(
              $rootScope.loc.NETWORK_ERROR,
              $rootScope.loc.NETWORK_ERROR_MESSAGE,
              {
                title: okTitle,
                color: 'blue',
              }
            )
            .then(
              function () {
                angular.element('.page-no-connection').hide();
                $rootScope.gotoView('/network-landing-local');
              },
              function () {
                angular.element('.page-no-connection').hide();
                $rootScope.gotoView('/network-landing-local');
              }
            );
        };

        /**
         * Opens the default mail application
         *
         * @memberof aboutDetails
         * @method openMail
         */
        $rootScope.openMail = function (address, subject) {
          address = address || '';
          subject = subject ? '?subject=' + subject : '';
          $rootScope.pausedForShare = true;
          window.open('mailto:' + address + subject, '_system');
        };

        /**
         * ($rootScope) Sets the policy index.
         *
         * @memberof MainController
         * @method selectPolicy
         * @param  {Number} index The desired policy index
         */
        $rootScope.selectPolicy = function (index) {
          $rootScope.indexOfSelectedMember = 0;
          if (!$rootScope.policies[index]) {
            $rootScope.policyIndex = $rootScope.policies[0].index;
            $rootScope.selectedPolicy = $rootScope.policies[0];
            $rootScope.noMatchPlanFound =
              $rootScope.selectedPolicy.vitalsMatchedPlanName === 'no match'
                ? true
                : false;
            TransparencyFactory.setSelectedPlan($rootScope.selectedPolicy);
            TransparencyFactory.setCurrentPolicyMembers(
              $rootScope.selectedPolicy.policyMembers
            );
            return;
          }
          $rootScope.policyIndex = $rootScope.policies[index].index;
          $rootScope.selectedPolicy = $rootScope.policies[index];
          $rootScope.noMatchPlanFound =
            $rootScope.selectedPolicy.vitalsMatchedPlanName === 'no match'
              ? true
              : false;
          TransparencyFactory.setSelectedPlan($rootScope.selectedPolicy);
          TransparencyFactory.setCurrentPolicyMembers(
            $rootScope.selectedPolicy.policyMembers
          );
          $rootScope.$emit('policySelected');
        };

        /**
         * ($rootScope) Gets TIP data object based on selectedPolicy
         *
         * @memberof MainController
         * @method getTIPData
         * @param  {String} transactionCode The transaction code
         * @param  {String} originatingURL The originating URL
         */
        $rootScope.getTIPData = function (transactionCode, originatingURL) {
          var localTime = new Date().toISOString().split('.')[0] + 'Z';
          var TIPData = { currentTime: localTime };

          if (transactionCode) {
            TIPData.transactionCode = transactionCode;
          }

          if (originatingURL) {
            TIPData.originatingURL = originatingURL;
          }

          if ($rootScope.selectPolicy) {
            TIPData.memberId =
              $rootScope.selectedPolicy.alphaPrefix +
              $rootScope.selectedPolicy.externalId;
            TIPData.lobCode = $rootScope.selectedPolicy.lobCode;
            TIPData.groupId = $rootScope.selectedPolicy.groupNumber;
            TIPData.sourceSystem = $rootScope.selectedPolicy.sourceSystem;
          } else {
            TIPData.error = 'No selected policy';
          }

          return TIPData;
        };

        /**
         *
         * @memberof MainController
         * @method selectsPlan
         *
         */
        $rootScope.selectsPlan = function () {
          $rootScope.$emit('selectsPlan');
        };

        /**
         * ($rootScope) Returns is a basic navbar is present to toggle the margin-top on the ng-view.
         *
         * @memberof MainController
         * @method hasBasicNavbar
         */
        $rootScope.hasBasicNavbar = function () {
          var basicNavbar = angular.element('.basic-navbar');
          return basicNavbar.length > 0;
        };

        /**
         * ($rootScope) Loads an app view.
         *
         * @memberof MainController
         * @method gotoView
         * @param  {String} url The view URL
         */
        $rootScope.gotoView = function (url) {
          if ($rootScope.closePolicySelect) {
            $rootScope.closePolicySelect();
          }

          if (url === '/logout') {
            return alertService
              .showAlert(
                $rootScope.loc.LOG_OUT_CONFIRM,
                null,
                { title: $rootScope.loc.LOG_OUT, color: 'red' },
                { title: $rootScope.loc.CANCEL }
              )
              .then(function () {
                $rootScope.logOut();
              });
          }
          $location.url(url);
        };

        /**
         * ($rootScope) Enters the payment flow, sets a variable in the Payment Flow Factory.
         *
         * @memberof MainController
         * @method enterPaymentFlow
         * @param  {String} desiredPaymentFlow Whether the user wants to setup a OTP or AutoPay
         */
        $rootScope.enterPaymentFlow = function (desiredPaymentFlow) {
          PaymentFlowFactory.setPaymentFlow(desiredPaymentFlow);

          if (desiredPaymentFlow === 'autopay-no-balance') {
            $location.url('/edit-autopay-flow/method');
          }
          if (
            desiredPaymentFlow === 'otp' ||
            desiredPaymentFlow === 'autopay'
          ) {
            $location.url('/payment/method');
          }
        };

        /**
         * ($rootScope) Passthrough to the cordovaService's openInBrowser function.
         *
         * @memberof MainController
         * @method openInBrowser
         * @param  {String} url       The URL to open.
         * @param  {String} [target]  The target to open the URL in ('_blank', '_self' or '_system').
         * @param  {Object} [options] cordova-plugin-inappbrower options.
         */
        $rootScope.openInBrowser = function (url, target, options) {
          cordovaService.openInBrowser(url, target, options);
        };

        /* SSO option 1
        /**
         * ($rootScope) Passthrough to the cordovaService's openInBrowser function to handle Authenticated and/or SSO calls.
         *
         * @memberof MainController
         * @method openInBrowser
         * @param  {String} url       The URL to open or "sso:{vendor}" (i.e. "sso:vitals").
         * @param  {String} [target]  The target to open the URL in ('_blank', '_self' or '_system').
         * @param  {Object} [options] cordova-plugin-inappbrower options.
         */
        $rootScope.openInSecureBrowser = function (url, target, options) {
          cordovaService.openInBrowser(url, target, options, true);
          loginService.getUserId().then(function (userId) {
            return $http.post(config.apiUrl + '/data/logging', {
              memberId: userId,
              url: url,
            });
          });
        };

        /**
         * ($rootScope) Passthrough to the cordovaService's openInBrowser function to handle SSO calls.
         *
         * @memberof MainController
         * @method openInBrowser
         * @param  {String} url       The URL to open.
         * @param  {String} [target]  The target to open the URL in ('_blank', '_self' or '_system').
         * @param  {Object} [options] cordova-plugin-inappbrower options.
         *
        $rootScope.openSSOInBrowser = function(url, target, options) {
            var credentials = [];
            credentials.push(loginService.getEncryptedCredentials($rootScope.userNameIn, $rootScope.passwordIn));
            cordovaService.openInBrowser(url, target, options, credentials);
        };*/

        /**
         * ($rootScope) Returns the current view URL.
         *
         * @memberof MainController
         * @method getViewUrl
         * @return {String} The current view URL
         */
        $rootScope.getViewUrl = function () {
          return $location.url();
        };

        /**
         * ($rootScope) Sets the application language.
         *
         * @memberof MainController
         * @method setLanguage
         * @param  {String} [lang] i18n language code
         * @return {Promise} A promise that resolves to function(language)
         */
        $rootScope.setLanguage = function (lang) {
          return languageService.setLanguage(lang).then(function (language) {
            $rootScope.language = language;
            return language;
          });
        };

        /**
         * ($rootScope) Retrieves the locale from the server.
         *
         * @memberof MainController
         * @method getLocale
         */
        $rootScope.getLocale = function () {
          return languageService
            .getLocale($rootScope.language)
            .then(function (locale) {
              $rootScope.loc = locale;
              $rootScope.$emit('localeRetrieved');
              return locale;
            });
        };

        $rootScope.$on('pageNeedsLocale', $rootScope.getLocale);

        $rootScope.billingTrackStates = function (step, billingInfo) {
          var userData = PaymentFlowFactory.getUserSetData();
          var billingMethod = userData.billingMethod;
          var trackingDetails = {};
          var pageName = 'billing' + step[0].toUpperCase() + step.slice(1);

          if (billingInfo && billingInfo.currentInvoice && userData) {
            var frequency =
              PaymentFlowFactory.getPaymentFlow() || userData.paymentFrequency;
            var pastDue = billingInfo.currentInvoice.balanceForwardAmount;

            if (billingInfo.paymentOverdue && pastDue == 0) {
              pastDue = billingInfo.currentInvoice.totalDueAmount;
            }

            if (frequency) {
              frequency = /auto/.test(frequency) ? 'autopay' : 'onetime';
            }

            if (!billingMethod && frequency == 'onetime') {
              billingMethod = billingInfo.isMedicare ? 'postal' : 'email';
            }

            setPropertyValue(
              trackingDetails,
              'isMedicare',
              billingInfo.isMedicare
            );
            setPropertyValue(trackingDetails, 'billingMethod', billingMethod);
            setPropertyValue(
              trackingDetails,
              'paymentMethod',
              userData.paymentMethod
            );
            setPropertyValue(
              trackingDetails,
              'amount',
              userData.paymentAmount,
              true
            );
            setPropertyValue(
              trackingDetails,
              'currentAmountDue',
              billingInfo.currentInvoice.billedAmount,
              true
            );
            setPropertyValue(
              trackingDetails,
              'balance',
              billingInfo.currentInvoice.totalDueAmount || '0',
              true
            );
            setPropertyValue(trackingDetails, 'pastDue', pastDue, true);
            setPropertyValue(
              trackingDetails,
              'frequency',
              billingInfo.autoPay ? 'autopay' : frequency
            );
            setPropertyValue(
              trackingDetails,
              'misc',
              billingInfo.processingPay ? 'processing' : false
            );

            adobeService.trackState(
              pageName,
              analyticConstants.BILLING_SECTION,
              trackingDetails
            );

            if (pageName == 'billingConfirmation') {
              adobeService.trackAction(
                pageName,
                analyticConstants.BILLING_SECTION,
                trackingDetails
              ); // custom metrics requires action
            }
          } else {
            console.warn(
              'Required data not available in billingTrackStates for page:' +
                pageName
            );
          }
        };

        $rootScope.healthNavTrackActions = function (
          type,
          transparencyInfo,
          section
        ) {
          healthNavTracking(true, type, transparencyInfo, section);
        };

        $rootScope.healthNavTrackStates = function (
          type,
          transparencyInfo,
          section
        ) {
          healthNavTracking(false, type, transparencyInfo, section);
        };

        $rootScope.healthNavTrackToggleActions = function (
          prefix,
          name,
          toggle
        ) {
          $rootScope.healthNavTrackActions(0, {
            title: prefix + ': ' + name + ':' + (toggle ? 'open' : 'close'),
          });
        };

        function healthNavTracking(isAction, type, transparencyInfo, section) {
          var userData = TransparencyFactory.getUserSetData();
          var trackingDetails = {};
          var pageName = 'provider search: ';
          var filters = {};

          section = section || analyticConstants.HEALTHNAV_SECTION;

          if (transparencyInfo && userData) {
            // searchTerm / searchCategory / pageName properties
            var searchTerm;
            var searchCategory = $location.search().searchTerm;

            switch (type) {
              case 0:
                searchTerm = transparencyInfo.searchTerm;
                pageName += transparencyInfo.title;
                break;
              case 1:
                searchTerm = userData.resultsTerm;
                pageName += 'search results: ' + searchTerm;
                setPropertyValue(
                  trackingDetails,
                  'providerResultsPage',
                  transparencyInfo.page || 1
                );
                break;
              case 2:
                searchTerm = userData.resultsDetailsTerm;
                pageName += 'profile: ' + searchTerm;
                break;
              case 3:
                searchTerm = transparencyInfo.searchTerm;
                pageName += 'search results: ' + searchTerm;
                setPropertyValue(
                  trackingDetails,
                  'providerEmptySearchTerm',
                  searchTerm
                );
                break;
              case 4:
                searchTerm = transparencyInfo.searchTerm;
                pageName += 'guided search: ' + searchTerm;
                break;
            }

            // create comma delimitted filter string
            setPropertyValue(filters, 'radius', userData.distance);
            setPropertyValue(
              filters,
              'zipCode',
              userData.city ? userData.city.zip : ''
            );
            setPropertyValue(
              filters,
              'professional_gender',
              userData.filterGender
            );
            setPropertyValue(
              filters,
              'field_specialty_ids',
              userData.filterSpecialty
            );
            setPropertyValue(
              filters,
              'smartShopperOnly',
              userData.smartShopperFilter
            );

            if (userData.filterTier) {
              setPropertyValue(
                filters,
                userData.filterTier.type,
                userData.filterTier.value
              );
            }

            filters = JSON.stringify(filters)
              .replace(/"/g, '')
              .substr(1)
              .slice(0, -1);

            setPropertyValue(trackingDetails, 'providerFilters', filters);
            setPropertyValue(trackingDetails, 'providerSearchTerm', searchTerm);
            setPropertyValue(
              trackingDetails,
              'providerSearchCategory',
              searchCategory
            );
            setPropertyValue(
              trackingDetails,
              'geoLocation',
              $rootScope.vitalsGeoCoords
            );
            setPropertyValue(
              trackingDetails,
              'geoLocationAllowed',
              userData.geoLocationStatus
            );
            setPropertyValue(
              trackingDetails,
              'providerView',
              $rootScope.openMapView ? 'map' : 'list'
            );

            if ($rootScope.selectedPlan) {
              setPropertyValue(
                trackingDetails,
                'providerNetworkId',
                $rootScope.selectedPlan.id
              );
              setPropertyValue(
                trackingDetails,
                'providerNetworkName',
                $rootScope.selectedPlan.name
              );
            }

            if (isAction) {
              adobeService.trackAction(
                pageName.toLowerCase(),
                section,
                trackingDetails
              );
            } else {
              adobeService.trackState(
                pageName.toLowerCase(),
                section,
                trackingDetails
              );
            }
          } else {
            console.warn(
              'Required data not available in transparencyTracking for page:' +
                pageName
            );
          }
        }

        function setPropertyValue(
          details,
          propertyName,
          propertyValue,
          isNumber
        ) {
          if (propertyValue || propertyValue === false) {
            if (isNumber) {
              propertyValue = parseFloat(propertyValue.toString())
                .toFixed(2)
                .toString();
            }
            details[propertyName] = propertyValue;
          }
        }

        /**
         * ($rootScope) Retrieves the internal locale for offline use.
         *
         * @memberof MainController
         * @method getInternalLocale
         */
        $rootScope.getInternalLocale = function () {
          $rootScope.loc = languageService.getInternalLocale(
            $rootScope.language
          );
          return $rootScope.loc;
        };

        /**
         * ($rootScope) Checks to make sure language is set and retrieves it and locale if not.
         *
         * @memberof MainController
         * @method verifyLocaleRetrieved
         */
        $rootScope.verifyLocaleRetrieved = function () {
          if (!$rootScope.language) {
            $rootScope.setLanguage().then(function () {
              $rootScope.getLocale();
            });
          }
        };

        /**
         * ($rootScope) Logs a member out of the app by removing their stored authorization.
         *
         * @memberof MainController
         * @method logOut
         */
        $rootScope.logOut = function () {
          $rootScope.checkNetwork();
          loginService
            .getAuthorization()
            .then(function (authObj) {
              if (authObj && Object.keys(authObj).length) {
                if (authObj.rememberUserId === true) {
                  return $q.resolve(true);
                }
                return loginService.setAuthorization({});
              } else {
                return $q.resolve(true);
              }
            })
            .then(function () {
              // defined in AngularJS-Services-Cloud
              var cache = CacheFactory.get('defaultCache');
              loginService.setUserLoggedOutFlag(true);
              if (cache) {
                CacheFactory.clearAll();
              }
              $rootScope.loggedIn = false;
              $rootScope.selectedPolicy = null;
              $rootScope.$emit('LOGOUT');

              if ($rootScope.offline && !$rootScope.online) {
                $rootScope.showNav = false;
                $rootScope.showPolicySelect = false;
                angular.element('.page-no-connection').hide();
                $rootScope.gotoView('/network-landing-local');
              } else {
                return cordovaService.verifyMinAppVersion().then(function () {
                  $rootScope.gotoView('/login');
                  return true;
                });
              }
            });
        };

        /**
         * Retrieves the navbar component from the component service.
         *
         * @memberof MainController
         * @method getNavbar
         */
        $scope.getNavbar = function () {
          $scope.navbarHtml = '<navbar-loading></navbar-loading>';

          if (!!$rootScope.loggedIn === false) {
            return $q.reject('User is not logged in');
          }
          return componentService
            .getComponent(
              componentService.devices.MOBILE,
              'navbar',
              $rootScope.language || 'en',
              {
                policyIndex: $rootScope.policyIndex,
                deviceType: $rootScope.device,
                planId: $rootScope.selectedPolicy.id,
                vitalsMatchedPlanName:
                  $rootScope.selectedPolicy.vitalsMatchedPlanName,
                unreadMessages: $rootScope.unreadMessages,
              }
            )
            .then(function (navbarHtml) {
              $scope.navbarHtml = navbarHtml;
              return navbarHtml;
            });
        };

        /**
         * Retrieves the member's policies from the data service.
         *
         * @memberof MainController
         * @method getSignature
         */
        $scope.getSignature = function () {
          return restService
            .getData('signature', $rootScope.language || 'en')
            .then(function (indicators) {
              $rootScope.signature = new Map(indicators);
              console.log($rootScope.policyIndex);
              console.log($rootScope.signature.get($rootScope.policyIndex));
            })
            .catch(function (err) {
              console.log(err);
            });
        };

        /**
         * @description Retrieves the member's policies from the data service.
         * @memberof MainController
         * @method getPolicies
         */
        $scope.getPolicies = function () {
          var deferred = $q.defer();

          restService.getData('policies', $rootScope.language || 'en').then(
            function (policies) {
              $rootScope.policies = policies;
              for (var i = 0; i < policies.length; i++) {
                if (policies[i].defaultPolicy) {
                  $rootScope.selectPolicy(i);
                  break;
                }
              }

              $scope.getAnalyticsInfo().then(
                function () {
                  deferred.resolve(policies);
                },
                function () {
                  deferred.resolve(policies);
                }
              );
            },
            function (err) {
              deferred.reject(err);
            }
          );

          return deferred.promise;
        };

        /**
         * Retrieves the analytics info from the data service.
         *
         * @memberof MainController
         * @method getAnalyticsInfo
         */
        $scope.getAnalyticsInfo = function () {
          var deferred = $q.defer();

          restService
            .getData('analytics-info', $rootScope.language || 'en')
            .then(
              function (analyticsInfo) {
                $rootScope.analyticsInfo = analyticsInfo;
                deferred.resolve(analyticsInfo);
              },
              function (err) {
                deferred.reject(err);
              }
            );

          return deferred.promise;
        };

        /**
         * Returns whether or not the background image should display.
         *
         * @memberof MainController
         * @method showBackgroundImage
         */
        $scope.showBackgroundImage = function () {
          var activeUrls = [
            '/',
            '/home',
            '/login',
            '/network-landing-local',
            '/upgrade',
          ];
          var location = $location.url();

          for (var i = 0; i < activeUrls.length; i++) {
            if (location === activeUrls[i]) {
              return true;
            }
          }

          return false;
        };

        /** Blur the activeElement
         *
         * @method hideKeybaord
         */
        $rootScope.hideKeyboard = function () {
          document.activeElement.blur();
        };

        /**
         * (eventListener) listens for device to be ready.
         *
         * @memberof MainController
         * @callback onDeviceReady
         * @event deviceready
         */
        $rootScope.checkNetwork = function () {
          return $q(function (resolve) {
            document.addEventListener(
              'deviceready',
              checkNetworkConnection,
              false
            );

            function checkNetworkConnection() {
              if (navigator.connection.type !== Connection.NONE) {
                $rootScope.offline = false;
                $rootScope.online = true;
              } else {
                $rootScope.offline = true;
                $rootScope.online = false;
              }
              resolve({
                offline: $rootScope.offline,
                online: $rootScope.online,
              });
            }
          });
        };

        /**
         * (eventListener) listens for Internet and data connection.
         *
         * @memberof onDeviceReady
         * @event offline
         */
        document.addEventListener('deviceready', onDeviceReady, false);
        function onDeviceReady() {
          document.addEventListener('offline', onOffline, false);
          function onOffline() {
            if (!$rootScope.loc || Object.keys($rootScope.loc).length === 0) {
              var locale = languageService.getInternalLocale();
              navigator.notification.alert(
                locale.NETWORK_ERROR_MESSAGE,
                onDismissed,
                locale.NETWORK_ERROR,
                locale.OK
              );
            } else {
              navigator.notification.alert(
                $rootScope.loc.NETWORK_ERROR_MESSAGE,
                onDismissed,
                $rootScope.loc.NETWORK_ERROR,
                $rootScope.loc.OK
              );
            }
            function onDismissed() {
              angular.element('.page-no-connection').show();
              angular.element('.navbar-menu-list').css('height', 54 + '%');
              angular.element('.login-bottom-bar').css('margin-bottom', 28);
              angular.element('.navbar-menu-bottom').css('margin-bottom', 28);
            }

            navigator.notification.alert(
              $rootScope.loc.NETWORK_ERROR_MESSAGE,
              onDismissed,
              $rootScope.loc.NETWORK_ERROR,
              $rootScope.loc.OK
            );
          }

          document.addEventListener('online', onOnline, false);

          function onOnline() {
            var networkState = navigator.connection.type;
            if (networkState !== Connection.NONE) {
              angular.element('.page-no-connection').hide();
              angular.element('.login-bottom-bar').css('margin-bottom', 0);
              angular.element('.navbar-menu-bottom').css('margin-bottom', 0);
            }
          }
        }

        /**
         * (eventListener) listens for Android back button.
         *
         * @memberof onDeviceReady
         * @event backbutton
         * @param browserEvent
         **/
        document.addEventListener(
          'deviceready',
          function () {
            document.addEventListener(
              'backbutton',
              function (browserEvent) {
                var currentLocation = $location.path();
                browserEvent.preventDefault();
                $rootScope.blurContent = false;

                if (
                  angular.element('.alert-modal').is(':visible') ||
                  angular.element('.help-modal').is(':visible') ||
                  angular.element('.terms-modal').is(':visible') ||
                  angular.element('.quick-alert-modal').is(':visible') ||
                  angular.element('.full-screen-modal').is(':visible')
                ) {
                  browserEvent.preventDefault();
                  angular.element('.alert-modal').modal('hide');
                  angular.element('.help-modal').modal('hide');
                  angular.element('.terms-modal').modal('hide');
                  angular.element('.full-screen-modal').modal('hide');
                  angular.element('.quick-alert-modal').modal('hide');
                  angular.element('#app-container').removeClass('no-scroll');
                  angular.element('.main-wrapper').removeClass('blur');
                  angular.element('.policy-select').removeClass('blur');
                  angular.element('.claims-container').removeClass('blur');
                  angular.element('.modal-backdrop.in').remove();
                  angular.element('.navbar').toggleClass('blur', false);
                  $rootScope.blurContent = false;
                  browserEvent.preventDefault();
                } else if (
                  currentLocation === '/home' ||
                  currentLocation === '/login'
                ) {
                  browserEvent.preventDefault();
                  angular.element('.policy-select').removeClass('blur');
                  navigator.app.exitApp();
                } else if (
                  $rootScope.sentMessage ||
                  $rootScope.cliamSendMessage
                ) {
                  browserEvent.preventDefault();
                  angular.element('.policy-select').removeClass('blur');
                  history.go(-3);
                  navigator.app.backHistory();
                  $rootScope.sentMessage = false;
                  $rootScope.cliamSendMessage = false;
                } else if (currentLocation === '/network-landing-local') {
                  browserEvent.preventDefault();
                } else {
                  browserEvent.preventDefault();
                  angular.element('.policy-select').removeClass('blur');
                  navigator.app.backHistory();
                }
              },
              false
            );
          },
          false
        );
      },
    ]);
})();
