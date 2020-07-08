(function() {
  angular
    .module('blueconnect.mobile.filters.removeCommas', [])
    .filter('removeCommas', function capitalize() {
      return function(amt) {
        if (!amt) {
          return '';
        }

        return amt.replace(/,/g, '');
      }
    });
})();