(function() {
  angular
    .module('blueconnect.mobile.filters.billingHistoryToDateFilter', [])
    .filter('billingHistoryToDateFilter', [
      '$rootScope',
      function billingHistoryToDateFilter($rootScope) {
        return function(input, startMonth) {
          if (startMonth) {
            var endMonthList;
            endMonthList = input.filter(function(e) { return e.value <= startMonth.value; });
            return endMonthList;
          }else{
            return input;
          }
        }
      }]);
  })();
