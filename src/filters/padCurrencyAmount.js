(function() {
  angular
    .module('blueconnect.mobile.filters.padCurrencyAmount', [])
    .filter('padCurrencyAmount', function capitalize() {
      return function(amt) {
        if (!amt) {
          return '';
        }

        var amountDue = amt.toString();
        var cents = (amountDue.toString().slice(amountDue.indexOf('.') + 1));
        var dollars = amountDue.toString().slice(0, amountDue.indexOf('.')) || 0;
        return dollars + '.' + cents.padEnd(2, '0');
      }
    });
})();