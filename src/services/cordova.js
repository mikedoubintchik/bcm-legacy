/**
 * @description Services for managing actions only taken with physical devices.
 * @namespace Services
 * @class cordovaService
 */
(function() {
  "use strict";

  angular
    .module("blueconnect.mobile.services.cordova", [
      "blueconnect.mobile.services.touchId"
    ])
    .service('cordovaService', [
      '$rootScope',
      '$q',
      '$http',
      'alertService',
      'loginService',
      'storageService',
      'config',
      function ($rootScope, $q, $http, alertService, loginService, storageService, config) {
        /**
         * @description Checks device platform and OS version to determine if it's an old device.
         * @memberof cordovaService
         * @method checkForLowResDevice
         */

        this.checkForLowResDevice = function() {
          if (typeof cordova === "undefined") {
            return;
          }

          $rootScope.device = device.platform;
          $rootScope.lowResDevice = false;

          switch (device.platform) {
            case "iOS":
              var iosVersion = device.version;
              if (parseFloat(iosVersion) < 8) {
                $rootScope.lowResDevice = true;
              }
              break;
            case "Android":
            case "amazon-fireos":
              var androidVersion = device.version;
              if (androidVersion.indexOf("-") > -1) {
                androidVersion = androidVersion.substr(
                  0,
                  androidVersion.indexOf("-") + 1
                );
              }
              if (parseFloat(androidVersion) < 4.4) {
                $rootScope.lowResDevice = true;
              }
              break;
            default:
              break;
          }
        };

        this.deviceIsBrowser = function() {
          var deviceType = this.checkDeviceType();
          return deviceType.ios === false && deviceType.android === false;
        };

        // Checks for the device type, iphone or android.
        this.checkDeviceType = function () {
          if (typeof cordova === 'undefined' || typeof device === 'undefined') {
            return {
              ios: false,
              android: false
            };
          }

          $rootScope.device = device.platform;
          $rootScope.iphone = device.platform === "iOS";
          $rootScope.android =
            device.platform == "Android" || device.platform == "amazon-fireos";

          var platform = device.platform.toLowerCase();
          return {
            ios: platform === "ios",
            android: platform === "android" || platform === "amazon-fireos"
          };
        };

        /**
         * @description This method is called by the Settings page to update the local database.
         * @memberof cordovaService
         * @method updateAppSettings
         * @params {String} appKeyType The key for the data to be saved.
         * @params {Object} settingContent The data to be saved in the local database.
         * @return {Promise} A promise that resolves when the settings have been saved.
         */
        this.updateAppSettings = function (appKeyType, settingContent) {
          var apiUrl = config.apiUrl || 'https://api.bcbsnc.com';
          return $http.put(apiUrl + '/settings/' + appKeyType, settingContent)
        };

        /**
         * Opens a URL in the browser (internal or external).
         *
         * @memberof cordovaService
         * @method openInBrowser
         * @param  {String}  url       The URL to open.
         * @param  {String}  [target]  The target to open the URL in ('_blank', '_self' or '_system').
         * @param  {Object}  [options] cordova-plugin-inappbrower options.
         * @param  {Boolean} [secure]  Whether or not the connection is through SSO
         */
        this.openInBrowser = function(url, target, options, secure) {
          var self = this;
          var ref = null;
          var page = null;

          switch (true) {
            case url.page === "RxClmDetl":
              page = url.page;
              url = url.ssoLink;
              break;
            case url.indexOf("findavisionprovider") > -1: 
              page = "SSO-VisionVndr";
              break;
            case url === "sso:cvs": 
              page = "SSO-CVS";
              break;  
          }

          alertService
            .showAlert(
              $rootScope.loc.EXTERNAL_LINK,
              $rootScope.loc.EXTERNAL_LINK_WARNING,
              {
                title: $rootScope.loc.CONTINUE,
                color: "blue"
              },
              {
                title: $rootScope.loc.CANCEL
              }
            )
            .then(function() {
              // To view prescription drug claims
              if (page) {
                var apiUrl = config.apiUrl
                  ? config.apiUrl + "/" + config.apiVersion
                  : "https://mobile.bcbsnc.com/api";
                var query = {
                  policyindex: $rootScope.policyIndex,
                  pageTph: page,
                  lobCode: $rootScope.selectedPolicy.lobCode,
                  groupId: $rootScope.selectedPolicy.groupNumber,
                  sourceSystem: $rootScope.selectedPolicy.sourceSystem,
                  policyMemberId:
                    $rootScope.selectedPolicy.alphaPrefix +
                    $rootScope.selectedPolicy.externalId
                };
                $http.post(apiUrl + "/touch-point", query).then(function() {
                  return;
                });
              }

              if (typeof cordova !== "undefined") {
                if (typeof options === "undefined") {
                  options = {
                    location: "yes"
                  };
                }

                var optionsString = "";
                for (var key in options) {
                  if (optionsString.length) {
                    optionsString += ",";
                  }
                  optionsString += key + "=" + options[key];
                }
                if (secure) {
                  $rootScope.$emit("pageLoading");
                  switch (url.split(":")[0]) {
                    case "sso":
                      self.setupSSO(url).then(function(result) {
                        $rootScope.$emit("pageLoaded");
                        ref = cordova.InAppBrowser.open(
                          result,
                          target || "_blank",
                          optionsString
                        );
                      });
                      break;
                    case "appsso":
                      self.setupSSOApp(url).then(function(result) {
                        $rootScope.$emit("pageLoaded");
                        var scheme;
                        var storeUrl;
                        self.checkDeviceType();
                        if ($rootScope.iphone) {
                          scheme = "heqmobile://";
                          storeUrl =
                            "itms://itunes.apple.com/us/app/healthequity-mobile/id642959434?mt=8";
                        } else {
                          scheme = "com.healthequity.healthequitymobile";
                          storeUrl =
                            "http://play.google.com/store/apps/details?id=" +
                            scheme;
                        }
                        appAvailability.check(
                          scheme,
                          function() {
                            self.getHeqApp(result, optionsString);
                          },
                          function() {
                            window.open(storeUrl);
                          }
                        );
                      });
                      break;
                    case "mbsso":
                      self.getSecureDesktopLink(url).then(function(result) {
                        $rootScope.$emit("pageLoaded");
                        ref = cordova.InAppBrowser.open(
                          result,
                          target || "_blank",
                          optionsString
                        );
                      });
                      break;
                    default:
                      ref = cordova.InAppBrowser.open(
                        config.bcbsWebUrl + "/" + url,
                        target || "_blank",
                        optionsString
                      );
                      break;
                  }
                } else {
                  ref = cordova.InAppBrowser.open(
                    url,
                    target || "_blank",
                    optionsString
                  );
                  ref.addEventListener("loadstart", function(event) {
                    if (event.url.match("mobile/close")) {
                      ref.close();
                    }
                  });
                }
              }
            });
        };

        this.setAppSettings = function() {
          return $q.reject(
            "Do not use this method: setAppSettings in cordovaService"
          );
        };
        this.saveAppSetting = function(key, value) {
          return $q.reject(
            "Do not use this method: saveAppSetting in cordovaService"
          );
        };

        /**
         * Stores app settings to encrypted storage.
         *
         * @memberof cordovaService
         * @method storeAppSettings
         * @param {Object} settings The app settings to store.
         */
        this.storeAppSettings = function(settings) {
          if (typeof cordova === "undefined") {
            return $q.reject("cordova is not available");
          }

          return storageService
            .set("appSettings", settings)
            .then(function(result) {
              console.log("App settings saved.");
              return result;
            })
            .catch(function(error) {
              console.warn(error);
              return error;
            });
        };

        /**
         * @description Adds a watcher on login settings to auto save them in secure storage.
         * @memberof cordovaService
         * @method addAppSettingsWatch
         */
        // TODO: make this work with new login storage
        this.addAppSettingsWatch = function() {
          var self = this;

          if (typeof cordova === "undefined") {
            return;
          }

          $rootScope.$watch(
            "appSettings",
            function(newVal, oldVal) {
              if (newVal !== oldVal) {
                self.storeAppSettings(newVal);
              }
            },
            true
          );
        };

        this.getHeqApp = function(result, optionsString) {
          $rootScope.$emit("pageLoaded");
          optionsString += ",hidden=yes";
          var ref = cordova.InAppBrowser.open(result, "_blank", optionsString);
          ref.addEventListener("loaderror", function(error) {
            console.log(error);
          });
          ref.addEventListener("loadstart", function(event) {
            console.log(event.url);
            if (event.url.indexOf("heqmobile") === 0) {
              ref.close();
              window.open(event.url);
            }
          });
        };

        this.getSecureDesktopLink = function (url) {
          var bearerToken = null;
          var urlComponents = url.toLowerCase().split(':');
          var ssourl = urlComponents[0];
          var getHeaders = urlComponents[1];

          $rootScope.$emit('pageLoading');
          return loginService
            .getAuthorization()
            .then(function(authObject) {
              bearerToken = 'Bearer ' + authObject.accessToken;
              return $http.get(config.apiUrl + '/get-sso-json');
            })
            .then(function (result) {
              var headers = result.data[getHeaders];
              return $http({
                method: 'POST',
                url: config.bcbsWebMobileUrl + '/' + ssourl,
                headers: {
                  'Authorization': bearerToken,
                  'ssorelaystate': headers.ssorelaystate,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              });
            })
            .then(function (result) {
              $rootScope.$emit('pageLoaded');
              return ('data:text/html;base64,' + btoa(result.data));
            })
            .catch(function(error) {
              console.warn('Error in SSO', error);
              $rootScope.$emit('pageLoaded');
            });
        };

        /**
         * Handles the SSO setup process.
         *
         * @memberof cordovaService
         * @method getSSO
         * @return {Promise} A promise that resolves to a SAML response.
         */
        this.setupSSO = function(url) {
          var self = this;
          var deferred = $q.defer();
          var dataObjIn = null;
          // Use components for dynamic SSO config
          var components = url
            .toLowerCase()
            .substr(4)
            .split(":");
          var vendor = components[0];
          var deepLink = components[1];

          // Step 1.  Get SSO Configuration from Blue Connect
          this.getSSOVendorData()

            // Step 2.  Get Secure Cookies
            .then(function() {
              $rootScope.$emit("pageLoading");
              return $http.get(
                self.getMobileURL(config.bcbsWebUrl) +
                  "/members/secure/index.htm"
              );
            })
            .then(
              function() {
                return true;
              },
              function() {
                return true;
              }
            )

            // Step 3.  Pass Through Convenience Method (if applicable)
            .then(function() {

              $rootScope.$emit("pageLoading");
              if (
                $rootScope.ssoData[vendor].technique === "convenience" ||
                $rootScope.ssoData[vendor].technique === "heq"
              ) {
                if (vendor === "vitals") {
                  dataObjIn = {
                    policyIndex: 0,
                    //urgentcareFlag: 'N',
                    //teleHealthVendor: 'MDLIVE',
                    //fundBalance: 'false',
                    urgentcareFlag: "",
                    teleHealthVendor: "",
                    fundBalance: "",
                    teleHealthRedirectURL:
                      "https://www.bcbsnc.com/members/secure/doctors/telehealth.htm"
                  };
                } else if (vendor === "prime"){
                  if ($rootScope.futurePolicy){
                    dataObjIn = {
                      policyIndex: 1
                    };
                  } else {
                    dataObjIn = {
                      policyIndex: 0
                    };
                  }
                } else {
                  dataObjIn = {
                    policyIndex: 0
                  };
                }

                var url = self.getMobileURL(
                  $rootScope.ssoData[vendor].urlList["configureUrl"]
                );

                return $http({
                  method: "POST",
                  url: url,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                      str.push(
                        encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])
                      );
                    }
                    return str.join("&");
                  },
                  data: dataObjIn
                });
              } else {
                return true;
              }
            })
            .then(
              function() {
                return true;
              },
              function() {
                return true;
              }
            )

            // Step 4.  Get SAML Response
            .then(function() {
              var url = null;
              $rootScope.$emit("pageLoading");

              url = self.getMobileURL(
                $rootScope.ssoData[vendor].urlList["linkUrl"]
              );

              if (deepLink) {
                url +=
                  "&Target=" +
                  $rootScope.ssoData[vendor].deepLinkList[deepLink];
              }

              return $http({
                method: "POST",
                url: url,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              });
            })

            // Step 5.  Send Output To InAppBrowser
            .then(function(result) {
              $rootScope.$emit("pageLoading");
              deferred.resolve("data:text/html;base64," + btoa(result.data));
            });

          return deferred.promise;
        };

        /**
         * @description Grabs the SSO vendor configuration data from Blue Connect.
         * @memberof cordovaService
         * @method getSSO
         * @return {Promise}
         */
        this.getSSOVendorData = function() {
          return $q(function(resolve, reject) {
            if ($rootScope.ssoData) {
              return resolve($rootScope.ssoData);
            }
            $http
              .get(config.bcbsWebUrl + "/members/secure/data/ssoVendors.json")
              .then(function(result) {
                $rootScope.ssoData = result.data;

                resolve(result.data);
              })
              .catch(reject);
          });
        };

        /**
         * @description Get the mobile version of a given URL.
         * @memberof cordovaService
         * @method getMobileURL
         * @return {String}
         */
        this.getMobileURL = function(url) {
          return url
            .replace(/(^https?:\/\/)(producer)/i, "$1mobile")
            .replace(/(^https?:\/\/)(www)/gi, "$1mobile");
        };

        /**
         * @description Retrieves the current app version and adds it to root scope.
         * @memberof cordovaService
         * @method getAppVersion
         * @return {Promise} A promise that resolves to function(version).
         */
        this.getAppVersion = getAppVersion;
        function getAppVersion() {
          if (typeof cordova === "undefined") {
            return $q.resolve(
              "not on real/emulated device, skipping version check"
            );
          }

          // wrapping in a $q promise because cordova promises are gross
          return $q(function(resolve, reject) {
            cordova
              .getAppVersion()
              .then(function(version) {
                $rootScope.appVersion = version;
                resolve(version);
              })
              .fail(reject);
          });
        }

        /**
         * @description Confirms that client side application version is valid.
         * @memberof cordovaService
         * @method verifyMinAppVersion
         * @return {Promise} A promise that resolves when client side application version is valid.
         */
        this.verifyMinAppVersion = function() {
          return $q(function(resolve, reject) {
            if (typeof cordova === "undefined") {
              // Get client application version
              return resolve(true);
            }

            getAppVersion()
              .then(function(version) {
                // Place call to Capra to verify application version
                return $http.post(config.capraApiUrl + "/version-validator", {
                  version: version
                });
              })
              .then(function(result) {
                if (result.data.valid) {
                  resolve(result.data);
                } else {
                  // If version is invalid, show modal that can not be closed
                  $rootScope.gotoView("/upgrade");
                }
              })
              .catch(reject);
          });
        };

        /**
         * Handles the SSO setup process.
         *
         * @memberof cordovaService
         * @method getSSO
         * @return {Promise} A promise that resolves to a SAML response.
         */
        this.setupSSOApp = function(url) {
          $rootScope.$emit("pageLoading");
          var urlComponents = url.toLowerCase().split(":");
          var ssourl = urlComponents[0];
          var getHeaders = urlComponents[1];
          var valuesReturn;
          return (
            $http
              .get(config.apiUrl + "/get-sso-json")
              .then(function(result) {
                valuesReturn = {
                  ssourl: ssourl,
                  headers: result.data[getHeaders]
                };
                return loginService.getAuthorization();
              })
              .then(function(authObject) {
                return $http({
                  method: "POST",
                  url: config.bcbsWebMobileUrl + "/mbsso",
                  headers: {
                    Authorization: 'Bearer ' + authObject.accessToken,
                    ssorelaystate: valuesReturn.headers.ssorelaystate,
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                });
              })
              .then(function() {
                return $http({
                  method: "POST",
                  url: config.heurl,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                });
              })
              .then(function(result) {
                $rootScope.$emit('pageLoaded');
                return "data:text/html;base64," + btoa(result.data);
              })
              .catch(function(error) {
                $rootScope.$emit('pageLoaded');
              })
          );
        };
      }
    ]);
})();