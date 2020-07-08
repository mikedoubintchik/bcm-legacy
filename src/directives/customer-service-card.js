/**
 * Directive for the customer service cards.
 *
 * @namespace Directives
 * @class customerServiceCard
 */
(function () {
  'use strict';

  angular.module('blueconnect.mobile.directives.customerServiceCard', [])
    .directive('customerServiceCard', [
      function (customerServiceHoursServices) {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/customer-service-card.html',
          scope: {
            /**
             * The customer service numbers details to display.
             *
             * @memberof customerServiceCard
             * @member {Object} customerServiceCardDetails
             */
            customerServiceCardDetails: '=',
            secureInbox: '=',
            localization: '='
          },
          controller: [
            '$scope',
            '$rootScope',
            'adobeService',
            function ($scope, $rootScope, adobeService) {
              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;
              $scope.customerServiceDetails = [];
              $scope.hideClosedNowHoursUnavailable = false;
              $scope.openRightNow = [];

              var section = 'Call Customer Service';
              $rootScope.startingView = section;
              var hoursForPDPTTY = null;
              var openSevenDaysPDPTTY = null;
              if ($rootScope.loggedIn && $rootScope.selectedPolicy.sourceSystem.toLowerCase() === 'amisys') {
                $scope.customerServiceCardDetails.forEach(function(element){
                  if (element.serviceTiltles.name === 'BlueMedicareRx(PDP)') {
                    hoursForPDPTTY = element.serviceHours.hours;
                    openSevenDaysPDPTTY = element.serviceHours.openSevenDays;
                  }
                  if (element.serviceTiltles.name === 'BlueMedicareRx(PDP)(TTY)') {
                  element.serviceHours.hours = hoursForPDPTTY ? hoursForPDPTTY : element.serviceHours.hours;
                  element.serviceHours.openSevenDays = openSevenDaysPDPTTY ? openSevenDaysPDPTTY : element.serviceHours.openSevenDays;
                  }
                });
              }

              for (var i = 0; i < $scope.customerServiceCardDetails.length; i++) {
                var singleServiceTitle = $scope.customerServiceCardDetails[i].serviceTiltles;
                var singleServiceHours = $scope.customerServiceCardDetails[i].serviceHours;

                var singleServiceDetails = {
                  title: singleServiceTitle.title,
                  phones: singleServiceHours.number,
                  icon: singleServiceTitle.icon,
                  class: singleServiceTitle.class,
                  openEveryday: singleServiceHours.openEveryday,
                  openSevenDays: singleServiceHours.openSevenDays,
                  twoOpenTimeTypes: singleServiceHours.twoOpenTimeTypes,
                  hours: singleServiceHours.hours,
                  url: singleServiceTitle.url,
                  mainContent: singleServiceTitle.mainContent,
                  questionTypes: singleServiceTitle.questionTypes,
                  // tty: (singleServiceTitle.name === 'ttytddnumber') ? true : false
                };

                if (singleServiceTitle.title.indexOf('TTY') >= 0) {
                  singleServiceDetails.tty = true;
                } else {
                  singleServiceDetails.tty = false;
                }

                $scope.customerServiceDetails.push(singleServiceDetails);
              }


              /**
               * Display information for the customer services cards
               *
               * @memberof customerServiceCard
               * @method convertDisplayTime
               */
              var convertDisplayTime = function (value) {
                var hoursH = null;
                var hoursM = null;
                var am = " a.m.";
                var pm = " p.m.";
                var colon = ":";
                if (value %100 === 0) {
                  hoursH = value / 100;
                  hoursM = "00";
                } else {
                  hoursH = Math.round(value / 100);
                  hoursM = value %100;
                }
                return hoursH > 11 ? (hoursH - 12 + colon + hoursM + pm) : 
                  (hoursH + colon + hoursM + am);
              };

              /**
               * Display information for the customer services cards
               *
               * @memberof customerServiceCard
               * @method mondayFridaySchedule
               */

              $scope.openHours = function(customerService, index) {
                var hours = customerService.hours;
                var openSevenDays = customerService.openSevenDays;
                var serviceHours = [];
                var hoursAvailableBoolean = [];
                var hoursNotAvailable;

                var openTimeType1 = null;
                var closeTimeType1 = null;
                var dayStringType1 = '';
                var timeStringType1 = '';
                var openTimeType2 = null;
                var closeTimeType2 = null;
                var dayStringType2 = '';
                var timeStringType2 = '';

                for (var i = 0; i < hours.length; i++) {

                  if (!openTimeType1 && !closeTimeType1 && !dayStringType1) {
                    openTimeType1 = hours[i].open;
                    closeTimeType1 = hours[i].close;
                    dayStringType1 = hours[i].day;
                    timeStringType1 = openTimeType1 + ' - ' + closeTimeType1;
                  } else if (hours[i].open === openTimeType1 && hours[i].close === closeTimeType1) {
                    if (dayStringType1.indexOf('-') > -1) {
                      dayStringType1 = dayStringType1.substring(0, dayStringType1.indexOf('-'));
                      dayStringType1 += ' - ' + hours[i].day;
                    } else {
                      dayStringType1 += ' - ' + hours[i].day;
                    }
                  } else if (hours[i].open !== openTimeType1 || hours[i].close !== closeTimeType1) {
                    if (!openTimeType2 && !closeTimeType2 && !dayStringType2) {
                      openTimeType2 = hours[i].open;
                      closeTimeType2 = hours[i].close;
                      dayStringType2 = hours[i].day;
                      timeStringType2 = openTimeType2 + ' - ' + closeTimeType2;
                    } else if (hours[i].open === openTimeType2 && hours[i].close === closeTimeType2) {
                      if (dayStringType2.indexOf('-') > -1) {
                        dayStringType2 = dayStringType2.substring(0, dayStringType2.indexOf('-'));
                        dayStringType2 += ' - ' + hours[i].day;
                      } else {
                        dayStringType2 += ' - ' + hours[i].day;
                      }
                    }
                  }
                }


                // if dayStringType1 exists
                if (!!dayStringType1 && dayStringType1.length > 0) {
                  // check if it's not closed(0000) and not notAvailable(9999) -> add timeString
                  if (timeStringType1.indexOf('0000') < 0 && timeStringType1.indexOf('9999') < 0) {
                    // only create a timeString when it's not closed and hours are available
                    timeStringType1 = convertDisplayTime(openTimeType1) + ' - ' + convertDisplayTime(closeTimeType1);
                    serviceHours.unshift(dayStringType1 + ': ' + timeStringType1);
                    hoursNotAvailable = false;
                    hoursAvailableBoolean.push(hoursNotAvailable);
                    // check if it's notAvaileble(9999) -> show message
                  } else if (timeStringType1.indexOf('9999') > -1) {
                    timeStringType1 = $rootScope.loc.HOURS_NOT_AVAILABLE;
                    serviceHours.unshift(dayStringType1 + ': ' + timeStringType1);
                    hoursNotAvailable = true;
                    hoursAvailableBoolean.push(hoursNotAvailable);
                  }
                }

                // if dayStringType2 exists
                if (!!dayStringType2 && dayStringType2.length > 0) {
                  // check if it's not closed(0000) and not notAvailable(9999) -> add timeString
                  if (timeStringType2.indexOf('0000') < 0 && timeStringType2.indexOf('9999') < 0) {
                    timeStringType2 = convertDisplayTime(openTimeType2) + ' - ' + convertDisplayTime(closeTimeType2);
                    serviceHours.unshift(dayStringType2 + ': ' + timeStringType2);
                    hoursNotAvailable = false;
                    hoursAvailableBoolean.push(hoursNotAvailable);
                    // check if it's notAvaileble(9999) -> show message
                  } else if (timeStringType2.indexOf('9999') > -1) {
                    timeStringType2 = $rootScope.loc.HOURS_NOT_AVAILABLE;
                    serviceHours.unshift(dayStringType2 + ': ' + timeStringType2);
                    hoursNotAvailable = true;
                    hoursAvailableBoolean.push(hoursNotAvailable);
                  }
                }

                if (openSevenDays) {
                  hoursNotAvailable = false;
                  hoursAvailableBoolean.push(hoursNotAvailable);
                }

                $scope.getOpenTimeToday(hours, index);

                return [
                    serviceHours,
                    hoursAvailableBoolean
                ];
              };

              $scope.getOpenTimeToday = function(hours, index) {
                var offset = -5.0;
                var whatDay = new Date();
                var utc = whatDay.getTime() + (whatDay.getTimezoneOffset() * 60000);
                var today = new Date(utc + (3600000 * offset));
                var day = today.getDay();
                var todayOPenTime = null;
                var todayCloseTime = null;

                todayOPenTime = hours[day].open;
                todayCloseTime = hours[day].close;

                /**
                 * Check if the services are opened now.
                 *
                 * @memberof mondayFridaySchedule
                 * @member {Boolean} openRightNow
                 */
                if (todayOPenTime != '9999' && todayCloseTime != '9999') {
                  if (today.getHours() >= todayOPenTime / 100 && today.getHours() < todayCloseTime / 100) {
                    $scope.openRightNow[index] = true;
                  } else {
                    $scope.openRightNow[index] = false;
                  }
                }
              };

            }
          ]
        };
      }
    ]);
}());
