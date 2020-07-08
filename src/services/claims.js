/**
 * Service for working with claims.
 *
 * @namespace Services
 * @class claimsService
 */

(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.claims', [])
    .service('claimsService', [
      '$rootScope',
      function($rootScope) {
        /**
         * This method generates the service request for the user entering search keywords.
         *
         * @memberof claimsService
         * @method generateSearchQuery
         * @param  {String}  userQuery         The keyword value entered by user for searching.
         * @param  {Date}    policyStartMonth  The currently selected policy's start date.
         * @param  {Date}    policyEndMonth    The currently selected policy's end date.
         */
        this.generateSearchQuery = function(
          userQuery,
          policyStartMonth,
          policyEndMonth
        ) {
          var basicSearch =
            'keyword=' +
            userQuery +
            '&' +
            'fromDate=' +
            '' +
            '&' +
            'toDate=' +
            '';

          return basicSearch;
        };

        /**
         * This method generates the service request for the user entering filter criteria.
         *
         * @memberof claimsService
         * @method generateFilterQuery
         * @param  {Object}  selection         The holding area for those member's selected.
         * @param  {String}  claimsStatus      The selected status for the claim.
         * @param  {Date}    startMonth        The starting filter date.
         * @param  {Date}    endMonth          The ending filter date.
         * @param  {Date}    policyStartMonth  The currently selected policy's start date.
         * @param  {Date}    policyEndMonth    The currently selected policy's end date.
         * @param  {String}  keyword           The currently selected keyword passed in
         */
        this.generateFilterQuery = function(
          selection,
          claimsStatus,
          startMonth,
          endMonth,
          policyStartMonth,
          policyEndMonth,
          keyword
        ) {
          claimsStatus = claimsStatus || '';
          startMonth = startMonth || '';
          endMonth = endMonth || '';
          policyStartMonth = policyStartMonth || '';
          policyEndMonth = policyEndMonth || '';
          keyword = keyword || '';

          var selectionArray = [];
          var queryPath =
            'claimsStatus=' +
            claimsStatus +
            '&' +
            'fromDate=' +
            startMonth +
            '&' +
            'toDate=' +
            endMonth +
            '&' +
            'keyword=' +
            keyword;

          if (selection != undefined) {
            var selectionString = String(selection);
            selectionArray = selectionString.split(',');
            for (var index = 0; index < selectionArray.length; index++) {
              queryPath += '&dependentNo=' + selectionArray[index];
            }
          }

          //console.log('Front End Query: ' + queryPath);

          return queryPath;
        };

        /**
         * This method generates filter date dropdown lists for the searching claims.
         *
         * @memberof claimsService
         * @method generateFilterDates
         * @param  {Object}  selectedPolicy  The currently selected policy.
         */
        this.generateFilterDates = function(selectedPolicy) {
          var filteredDates = {
            startDates: [],
            endDates: [],
          };

          var ONE_DAY = 1000 * 60 * 60 * 24;
          var policyStartDate = new Date(selectedPolicy.effectiveDate);
          var policyEndDate = new Date(selectedPolicy.expirationDate);

          if (
            Math.ceil(
              (policyEndDate.getTime() - policyStartDate.getTime()) / ONE_DAY
            ) <= 31
          ) {
            //Valid for only one month
            filteredDates.startDates.push(createDateValue(policyStartDate));
            filteredDates.endDates.push(createDateValue(policyEndDate));
          } else if (policyEndDate.getFullYear() >= 2099) {
            //Active Policy with no effective end date
            policyEndDate = new Date(policyStartDate.getFullYear(), 11, 31);
            generateDateOptions(policyStartDate, policyEndDate, filteredDates);
          } else {
            generateDateOptions(policyStartDate, policyEndDate, filteredDates);
          }

          return filteredDates;
        };

        /**
         * This sets the default members list to all checked or all not checked.
         *
         * @memberof claimsService
         * @method initializeMemberList
         * @param {Object}  members         The members associated with the current policy.
         * @param {boolean} isChecked       The flag used to determine if all members are selected or not.
         */
        this.initializeMemberList = function(members, isChecked) {
          var membersSelected = [];

          if (isChecked) {
            for (var i = 0; i < members.length; i++) {
              membersSelected.push(members[i].dependentNo);
            }
          }

          return membersSelected;
        };

        /**
         * This is used to reset the filter ribbon text to its default values
         *
         * @memberof claimsService
         * @method displayNoFilterText
         */
        this.displayNoFilterText = function() {
          return $rootScope.loc.CLAIMS_NO_FILTER;
        };

        /**
         * This is used to display the claims count within filter ribbon text.
         *
         * @memberof claimsService
         * @method displayClaimsCount
         * @param {Object}  claims         The collection of claims used to determine count
         */
        this.displayClaimsCount = function(claims) {
          var claimsCount = claims.length;
          var claimsCountText = '';

          if (claimsCount === 1) {
            claimsCountText = claimsCount + ' ' + $rootScope.loc.CLAIM;
          } else if (claimsCount === 0 || claimsCount > 1) {
            claimsCountText = claimsCount + ' ' + $rootScope.loc.CLAIMS;
          }

          return claimsCountText;
        };

        var generateDateOptions = function(startDate, endDate, filteredDates) {
          var nextMonth = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1
          );

          while (nextMonth <= endDate) {
            var startOfMonth = new Date(
              nextMonth.getFullYear(),
              nextMonth.getMonth(),
              1
            );
            var endOfMonth = new Date(
              nextMonth.getFullYear(),
              nextMonth.getMonth() + 1,
              0
            );

            filteredDates.startDates.push(createDateValue(startOfMonth));
            filteredDates.endDates.push(createDateValue(endOfMonth));

            nextMonth.setMonth(nextMonth.getMonth() + 1);
          }
        };

        var createDateValue = function(dateValue) {
          var newDate = {
            id: dateValue.getFullYear() + '-' + dateValue.getMonth(),
            name:
              $rootScope.loc[
                moment(dateValue)
                  .format('MMMM')
                  .toUpperCase()
              ] + moment(dateValue).format(' YYYY'),
            value: moment(dateValue).format('YYYY-MM-DD'),
          };

          return newDate;
        };
      },
    ]);
})();
