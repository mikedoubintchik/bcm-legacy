(function() {
  angular
    .module('blueconnect.mobile.filters.capitalize', [])
    .filter('capitalize', function capitalize() {
      return function(inputStr) {
        if (!inputStr) {
          return '';
        }

        return inputStr[0].toUpperCase() + inputStr.slice(1).toLowerCase();
      }
    });
})();