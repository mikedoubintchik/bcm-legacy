(function() {
  angular
    .module('blueconnect.mobile.filters.limitFilter', [])
    .filter('limit', function limitNumber() {
      return function(value, options) {
        // Min value.
        var min = Number(options.min);

        // Min value check.
        if (min && min > value) {
          return min;
        }

        // Max value.
        var max = Number(options.max);

        // Max value check.
        if (max && max < value) {
          return max;
        }

        // Return amount.
        return value;
      };
    });
})();
