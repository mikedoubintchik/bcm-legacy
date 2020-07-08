(function() {
  angular
    .module('blueconnect.mobile.filters.toDropDownFilter', [])
    .filter('toDropDownFilter', [
      '$rootScope',
      function toDropDownFilter($rootScope) {
        return function(input, startMonth) {
          if (startMonth) {
            var endMonthList;
            var index;
            var currentYear = $rootScope.loc[moment(startMonth).format('MMMM').toUpperCase()] + moment(startMonth).format(' YYYY');
            function month(selectedMonth){
              return selectedMonth.name == currentYear;
            };
            index = input.findIndex(month);
            endMonthList = input.slice(index);
            return endMonthList;
          }
          else {
            return input;
          }
        }
      }]);
  })();
