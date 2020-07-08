(function () {
  angular
      .module('blueconnect.mobile.filters.maskAccount', [])
      .filter('maskAccount', function maskAccount() {
        return function (acct) {
          if (!acct) {
            return '';
          }
          var beginMask;
          var endMask;
          var mask;

          if (acct.toString().length == 4) {
            var str1 = "XXXXXXXXXXXX";
            var res = str1.concat(acct);
            beginMask = res.substr(0, res.length - 4);
            endMask = res.substr(res.length - 4, 4);
            mask = beginMask.replace(/[0-9, X]/g, '\u2022') + endMask;
            return mask;
          }
          var maskacct = acct.toString();
          beginMask = maskacct.substr(0, maskacct.length - 4);
          endMask = maskacct.substr(maskacct.length - 4, 4);
          mask = beginMask.replace(/[0-9, X]/g, '\u2022') + endMask;
          return mask;
        }
      });
})();