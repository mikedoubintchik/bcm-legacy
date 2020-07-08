(function() {
  angular
    .module('blueconnect.mobile.services.billingInvoiceHistoryFactory', [])
    .factory('BillingInvoiceHistoryFactory', [function() {
      // Moment object dates
      var searchFromDate = null;
      var searchToDate = null;
      var serviceDateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZZ';

      var userSetData = {
        historyType: 'A',
        timeSpan: '3',
        token: null,
        dateList: null,
        startIndex: null,
        endIndex: null,
        startDate: null,
        endDate: null
      };

      return {
        serviceFormattedSearchFromDate: serviceFormattedSearchFromDate,
        getSearchFromDate: getSearchFromDate,
        setSearchFromDate: setSearchFromDate,
        serviceFormattedSearchToDate: serviceFormattedSearchToDate,
        getSearchToDate: getSearchToDate,
        setSearchToDate: setSearchToDate,
        getFilterTimespan: getFilterTimespan,
        getHistoryType: getHistoryType,
        setHistoryType: setHistoryType,
        getUserSetData: getUserSetData,
        getTimeSpan: getTimeSpan,
        setTimeSpan: setTimeSpan,
        getDateList: getDateList,
        setDateList: setDateList,
        getStartIndex: getStartIndex,
        setStartIndex: setStartIndex,
        getEndIndex: getEndIndex,
        setEndIndex: setEndIndex,
        getStartDate: getStartDate,
        setStartDate: setStartDate,
        getEndDate: getEndDate,
        setEndDate: setEndDate,
        getAccountToken: getAccountToken,
        setAccountToken: setAccountToken,
        setMedicareSSAValue: setMedicareSSAValue,
        getMedicareSSAValue: getMedicareSSAValue,
        resetFilter: resetFilter
      };

      /**
       * @return {string}
       */
      function serviceFormattedSearchFromDate() {
        return momentSearchFromDate().format(serviceDateTimeFormat);
      }
      /**
       * @return {Moment}
       */
      function momentSearchFromDate() {
        return searchFromDate || moment(momentSearchToDate()).subtract(3, 'months');
      }
      /**
       *
       */
      function setSearchFromDate(setDate) {
        searchFromDate = setDate;
      }

      function getSearchFromDate() {
        return searchFromDate;
      }

      /**
       * @return {string}
       */
      function serviceFormattedSearchToDate() {
        return momentSearchToDate().add(1, 'M').format(serviceDateTimeFormat);
      }
      /**
       * @return {Moment}
       */
      function momentSearchToDate() {
        return searchToDate || moment();
      }
      /**
       *
       */
      function setSearchToDate(setDate) {
        searchToDate = setDate;
      }
      function getSearchToDate() {
        return searchToDate;
      }
      /**
       * @typedef {InvoiceTimeSpan}
       * @param {Moment} searchFromDate
       * @param {Moment} searchToDate
       * @param {Number} timespan - Months between the searchFromDate and the searchToDate
       */

       /**
       * @return {InvoiceTimespan}
       */
      function getFilterTimespan() {
        return {
          searchFromDate: momentSearchFromDate(),
          searchToDate: momentSearchToDate(),
          timespan: getTimeSpan()
        };
      }

      function getHistoryType() {
        return userSetData.historyType;
      }
      function setHistoryType(type) {
        userSetData.historyType = type;
        return userSetData.historyType;
      }
      function getTimeSpan() {
        return userSetData.timeSpan;
      }
      function setTimeSpan(timespan) {
        userSetData.timeSpan = timespan;
        return userSetData.timeSpan;
      }
      function getDateList() {
        return userSetData.dateList;
      }
      function setDateList(dateList) {
        userSetData.dateList = dateList;
        return userSetData.dateList;
      }
      function getUserSetData() {
        return userSetData;
      }
      function getStartIndex() {
        return userSetData.startIndex;
      }
      function setStartIndex(startIndex) {
        userSetData.startIndex = startIndex;
        return userSetData.startIndex;
      }
      function getEndIndex() {
        return userSetData.endIndex;
      }
      function setEndIndex(endIndex) {
        userSetData.endIndex = endIndex;
        return userSetData.endIndex;
      }
      function getStartDate() {
        return userSetData.startDate;
      }
      function setStartDate(startDate) {
        userSetData.startDate = startDate;
        return userSetData.startDate;
      }
      function getEndDate() {
        return userSetData.endDate;
      }
      function setEndDate(endDate) {
        userSetData.endDate = endDate;
        return userSetData.endDate;
      }
      function getAccountToken() {
        return userSetData.token;
      }
      function setAccountToken(token) {
        userSetData.token = token;
        return userSetData;
      }
      function getMedicareSSAValue() {
        return userSetData.medicareSSA;
      }
      function setMedicareSSAValue(value) {
        userSetData.medicareSSA = value;
        return userSetData;
      }

      /**
       *
       */
      function resetFilter() {
        searchFromDate = null;
        searchToDate = null;
        setHistoryType('A');
        setTimeSpan('3');
      }
    }]);
})();