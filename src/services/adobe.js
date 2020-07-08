/**
 * Service for managing Adobe Mobile Services
 *
 * @namespace Services
 * @class adobeService
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.adobe', [])
    .directive('trackAction', [
      function() {
        return {
          restrict: 'A',
          controller: [
            '$scope',
            'adobeService',
            'analyticConstants',
            function($scope, adobeService, analyticConstants) {
              $scope.trackAction = adobeService.trackAction;
              $scope.analyticConstants = analyticConstants;
            },
          ],
          link: function($scope, $elem, $attr) {
            $elem.on('click', function() {
              var trackActionInfo = $scope.$eval($attr.trackAction);
              if (!trackActionInfo) {
                return console.warn('track action called with nothing passed in');
              }
              $scope.trackAction(
                trackActionInfo.action,
                trackActionInfo.section,
                trackActionInfo.details
              );
            });
          },
        };
      },
    ])
    .service('adobeService', [
      '$rootScope',
      '$window',
      'analyticConstants',
      function($rootScope, $window, analyticConstants) {
        var validSections = [];
        var sections = Object.keys(analyticConstants).filter(function(value) {
          return value.includes('SECTION');
        });

        sections.forEach(function(value) {
          validSections.push(analyticConstants[value]);
        });
        /**
         * Returns tracking details from information provided and rootscope variables.
         *
         * @param {Object} [details] Information that should be included in the tracking details.
         * @param {String} section   The section of the app the details correspond to.
         */
        function getTrackingDetails(details, section) {
          var trackingDetails = {
            loggedIn: $rootScope.loggedIn || false,
            language: getRootScopeLanguage(),
            section: getTrackingSection(section)
          };

          if (trackingDetails.loggedIn) {
            if (typeof details === 'string') {
              trackingDetails.query = details;
            }

            if ($rootScope.analyticsInfo) {
              trackingDetails.personId = $rootScope.analyticsInfo.info1;
              trackingDetails.ruid = $rootScope.analyticsInfo.info2;
            }

            if ($rootScope.selectedPolicy) {
              var i = $rootScope.selectedPolicy.index;

              trackingDetails.groupNumber = $rootScope.selectedPolicy.groupNumber;
              trackingDetails.groupName = $rootScope.selectedPolicy.groupName;
              trackingDetails.lobCode = $rootScope.selectedPolicy.lobCode;
              trackingDetails.isActive = $rootScope.selectedPolicy.active;

              if (
                $rootScope.selectedPolicy.policyMembers &&
                i < $rootScope.selectedPolicy.policyMembers.length
              ) {
                trackingDetails.ageRange = getAgeRange(
                  +$rootScope.selectedPolicy.policyMembers[i].ageNumber
                );
                trackingDetails.relationship =
                  getRelationship($rootScope.selectedPolicy.policyMembers[i].subscriberRelationshipCode);
                trackingDetails.gender = $rootScope.selectedPolicy.policyMembers[i].gender;
              }
            }
          }

          if (typeof details !== 'undefined' && typeof details === 'object') {
            trackingDetails = appendProperties(null, details, trackingDetails);
          }

          return trackingDetails;
        }

        // produces a flatten hierarchy of properties since adobe can only handle primitive values
        // input --> level1: {level2: {name2: 'value2'}, name1: 'value1'}
        // output--> level1.level2.name2 = 'value2', level1.name1 = 'value1'
        function appendProperties(prefix, properties, combinedProperties) {
            for (var key in properties) {
              var fullkey = prefix ? prefix + '.' + key : key;
              if (typeof properties[key] === 'object') {
                combinedProperties = appendProperties(fullkey, properties[key], combinedProperties);
              } else {
                combinedProperties[fullkey] = properties[key];
              }
            }

          return combinedProperties;
        }

        /**
         * Returns tracking section from information provided, uses analyticConstants
         *
         * @param {String} currentSection   The section of the app the details correspond to.
         * @see analyticConstants
         */
        function getTrackingSection(currentSection) {
          var section = '*' + currentSection;

          switch (true) {
            case validSections.includes(currentSection):
              section = currentSection;
              break;
            case /Billing/.test(currentSection):
              section = analyticConstants.BILLING_SECTION;
              break;
            case /Healthnav/.test(currentSection):
            case /find/i.test(currentSection):
              section = analyticConstants.HEALTHNAV_SECTION;
              break;
            case /Home/.test(currentSection):
              section = analyticConstants.HOME_SECTION;
              break;
            case /Menu/.test(currentSection):
              section = analyticConstants.MENU_SECTION;
              break;
            case /Id-card/.test(currentSection):
              section = analyticConstants.IDCARD_SECTION;
              break;
            case /Login/.test(currentSection):
              section = analyticConstants.LOGIN_SECTION;
              break;
            case /Setup/.test(currentSection):
              section = analyticConstants.SETTINGS_SECTION;
              break;
            case /inbox/i.test(currentSection):
              section = analyticConstants.INBOX_SECTION;
              break;
            case /Claim/.test(currentSection):
              section = analyticConstants.CLAIMS_SECTION;
              break;
            case /Benefit/.test(currentSection):
              section = analyticConstants.BENEFITS_SECTION;
              break;
            case /About/.test(currentSection):
            case /Feedback/.test(currentSection):
            case /customer-service/i.test(currentSection):
              section = analyticConstants.HELP_SECTION;
              break;
          }
          return section;
        }

        function getRootScopeLanguage() {
          var language = $rootScope.language || $window.navigator.language;
          var languages = {
            en: 'English',
            'en-US': 'English',
            es: 'Spanish',
            'es-US': 'Spanish',
            'es-ES': 'Spanish',
          };
          return languages[language] || language;
        }

        /**
         * Returns age range group that the provided age falls in.
         *
         * @param {number} age The age to categorize.
         *
         */
        function getAgeRange(age) {
          var ageRange = 'Unspecified';

          switch (true) {
            case age > 64:
              ageRange = '65 and Over';
              break;
            case age > 59:
              ageRange = '60 to 64';
              break;
            case age > 49:
              ageRange = '50 to 59';
              break;
            case age > 39:
              ageRange = '40 to 49';
              break;
            case age > 29:
              ageRange = '30 to 39';
              break;
            case age > 17:
              ageRange = '18 to 29';
              break;
            case age < 18:
              ageRange = 'Under 18';
              break;
          }

          return ageRange;
        }

        /**
         * Returns desktop relationship value from mobile one provided.
         *
         * @param {String} currentRelationship   The mobile relationship to convert.
         */
        function getRelationship(currentRelationship) {
          var relationship = '*' + currentRelationship;

          switch (true) {
            case /SUB/.test(currentRelationship):
              relationship = 'self';
              break;
            case /SPS/.test(currentRelationship):
              relationship = 'spouse';
              break;
            case /CHD/.test(currentRelationship):
              relationship = 'dependent';
              break;
            case /DBO/.test(currentRelationship):
              relationship = 'domestic_partner';
              break;
            case /OTH/.test(currentRelationship):
              relationship = 'other';
              break;
          }
          return relationship;
        }

        /**
         * Tracks an action inside the app.
         *
         * @memberof adobeService
         * @method trackAction
         * @param {String} eventName      The name of the event to track.
         * @param {String} section        The section of the app the event is in.
         * @param {Object} [eventDetails] Information object on the event.
         */
        this.trackAction = function(eventName, section, eventDetails) {
          var trackingDetails = getTrackingDetails(eventDetails, section);

          if ($window.ADB) {
            $window.ADB.trackAction(eventName, trackingDetails);
          } else {
            console.log('ADBTrackAction:', eventName, trackingDetails);
          }
        };

        /**
         * Tracks a change in app state.
         *
         * @memberof adobeService
         * @method trackState
         * @param {String} stateName      The name of the state to track.
         * @param {String} section        The section of the app the state is in.
         * @param {Object} [stateDetails] Information object on the state.
         */
        this.trackState = function(stateName, section, stateDetails) {
          var trackingDetails = getTrackingDetails(stateDetails, section);

          // short term debug for page equals billing
          if (stateName === 'billing') {
            trackingDetails.misc = new Error('billing').stack;
          }

          if ($window.ADB) {
            $window.ADB.trackState(stateName, trackingDetails);
          } else {
            console.log('ADBTrackState:', stateName, trackingDetails);
          }
        };
      },
    ]);
})();