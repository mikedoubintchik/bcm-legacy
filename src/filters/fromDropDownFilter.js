(function() {
  angular
    .module('blueconnect.mobile.filters.fromDropDownFilter', [])
    .filter('fromDropDownFilter', [
      '$rootScope',
      function fromDropDownFilter($rootScope) {
        return function(input, endMonth) {
          if (endMonth) {
            var startMonthList;
            var index;
            var currentYear = $rootScope.loc[moment(endMonth).format('MMMM').toUpperCase()] + moment(endMonth).format(' YYYY');
            function month(selectedMonth){
              return selectedMonth.name == currentYear;
            };
            index = input.findIndex(month) + 1;
            startMonthList = input.slice(0, index);
            return startMonthList;
          }
          else {
            return input;
          }
        }
      }]);
  })();
