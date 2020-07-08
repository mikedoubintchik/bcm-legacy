/**
 * Directive for customer service phone card
 *
 * @namespace Directives
 * @class customerServicePhoneCard
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.customerServicePhoneCard', [])
  .directive('customerServicePhoneCard', [
    function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/customer-service-phone-card.html',
        scope: {
          cardDetails: '=',
          localization: '=',
          policy: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          'adobeService',
          function($scope, $rootScope, adobeService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            $scope.customerServiceDetails = $scope.cardDetails.map(function(element) {
              const singleServiceTitle = element.serviceTitles;
              const singleServiceHours = element.serviceHours;
              const singleServiceDetails = {
                title: singleServiceTitle.title,
                phones: singleServiceHours.number,
                icon: singleServiceTitle.icon,
                class: singleServiceTitle.class,
                openEveryday: singleServiceHours.openEveryday,
                openSevenDays: singleServiceHours.openSevenDays,
                hours: singleServiceHours.hours,
                url: singleServiceTitle.url,
              };

              singleServiceDetails.tty = singleServiceTitle.title.indexOf('TTY') >= 0;

              return singleServiceDetails;
            });


            /**
             * Display information for the customer services cards
             *
             * @memberof customerServiceCard
             * @method convertDisplayTime
             */
            var convertDisplayTime = function(value) {
              var hours = value/100;
              var timeValue = ((hours > 12) ? hours - 12 + " p.m." : hours + " a.m.");

              return timeValue;
            };

            $scope.formatTime = function(str, section) {
              return str.split(':')[section === 'days' ? 0: 1];
            };

            $scope.openTimeHours = function(){
              $scope.timeStringIn = '';
              $scope.customerServiceDetails.forEach(function(element) {
                if (element.openSevenDays) {
                element.hours.forEach(function(hoursElement) {
                  var openTimeIn = hoursElement.open;
                    var closeTimeIn = hoursElement.close;
                      $scope.timeStringIn = convertDisplayTime(openTimeIn) + ' - ' + convertDisplayTime(closeTimeIn);
                });
              }
              });
              return $scope.timeStringIn;
            };

            /**
             * Display information for the customer services cards
             *
             * @memberof customerServiceCard
             * @method mondayFridaySchedule
             */
            var mondayFridaySchedule = function() {
              var dayString = '';
              var timeString = '';
              var serviceHours = [];
              var hoursAvailableBoolean = [];
              var hoursNotAvailable;
              var openTime;
              var closeTime;
              var offset = -4.0;
              var whatDay = new Date();
              var utc = whatDay.getTime() + (whatDay.getTimezoneOffset() * 60000);
              var today = new Date(utc + (3600000*offset));
              $scope.openRightNow = [];
              for (var i = 0; i < $scope.cardDetails.length; i++) {
                for (var j = 0; j < $scope.cardDetails[i].serviceHours.hours.length; j++) {

                  if(!openTime && !closeTime && !dayString) {
                    dayString = $scope.cardDetails[i].serviceHours.hours[j].day;
                    openTime = $scope.cardDetails[i].serviceHours.hours[j].open;
                    closeTime = $scope.cardDetails[i].serviceHours.hours[j].close;
                    timeString = openTime + ' - ' + closeTime;
                  } else if(openTime == $scope.cardDetails[i].serviceHours.hours[j].open && closeTime == $scope.cardDetails[i].serviceHours.hours[j].close ) {
                    if(dayString.indexOf('-') > 0) {
                      dayString = dayString.substring(0, dayString.indexOf('-'));
                      dayString = dayString + ' - ' + $scope.cardDetails[i].serviceHours.hours[j].day;
                    } else {
                      dayString = dayString + ' - ' + $scope.cardDetails[i].serviceHours.hours[j].day;
                    }
                  } else {
                    if (dayString.length > 1 && timeString.indexOf('0') < 0) {
                      if(openTime == '9999' && closeTime == '9999') {

                        serviceHours.push(timeString);
                        hoursAvailableBoolean.push(hoursNotAvailable);
                      } else {
                        serviceHours.push(dayString + ': ' + timeString);
                        hoursAvailableBoolean.push(hoursNotAvailable);
                      }
                    }


                    dayString = $scope.cardDetails[i].serviceHours.hours[j].day;
                    openTime = $scope.cardDetails[i].serviceHours.hours[j].open;
                    closeTime = $scope.cardDetails[i].serviceHours.hours[j].close;

                    if(openTime == '9999' && closeTime == '9999') {
                      timeString = $rootScope.loc.HOURS_NOT_AVAILABLE;
                      hoursNotAvailable = true;
                    } else {
                      timeString = convertDisplayTime(openTime) + ' - ' + convertDisplayTime(closeTime);
                      hoursNotAvailable = false;
                    }
                  }
                }

                var day = today.getDay();
                var todayOPenTime = $scope.cardDetails[i].serviceHours.hours[day].open;
                var todayCloseTime = $scope.cardDetails[i].serviceHours.hours[day].close;

                /**
                * Check if the services are opened now.
                *
                * @memberof mondayFridaySchedule
                * @member {Boolean} openRightNow
                */
                if(todayOPenTime != '9999' && todayCloseTime != '9999') {
                  if(today.getHours() >= todayOPenTime/100 && today.getHours() < todayCloseTime/100) {
                    $scope.openRightNow[i] = true;
                  } else {
                    $scope.openRightNow[i] = false;
                  }
                }
              }

              return [
                serviceHours,
                hoursAvailableBoolean
              ];
            };
            $scope.openHours = mondayFridaySchedule();
          }
        ]
      };
    }
  ]);
}());