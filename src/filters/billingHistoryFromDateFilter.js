(function() {
  angular
    .module('blueconnect.mobile.filters.billingHistoryFromDateFilter', [])
    .filter('billingHistoryFromDateFilter', [
      '$rootScope',
      function billingHistoryFromDateFilter($rootScope) {
        return function(input, startMonth) {
          if (startMonth) {
            var endMonthList;
            endMonthList = input.filter(function(e) { return e.value >= startMonth.value; });
            return endMonthList;
          }else{
            return input;
          }
        }
      }]);
  })();
