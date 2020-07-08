(function() {
  angular
    .module('blueconnect.mobile.filters.addLeadingZeroToSingleDigit', [])
    /**
     * @description
     * Adds a leading zero to a number to any single digit numbers, ex 1 becomes 01
     * @param {number|string} input
     * @return {string}
     */
    .filter('leadingZero', function() {
      return function(input) {
        return ('' + input).length === 1 ? '0' + input : '' + input;
      };
    });
})();