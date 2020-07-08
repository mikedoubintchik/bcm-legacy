(function() {
  /**
   * @description
   * A directive that displays the next invoice date
   */
  angular
    .module('blueconnect.mobile.directives.billingNextInvoiceDate',[])
    .directive('billingNextInvoiceDate', [function() {
      return {
        scope: {
          /**
           * @param {string} nextInvoiceDate Takes a utc formatted string
           */
          nextInvoiceDate: '<'
        },
        template: '<hr class="width-100"><h4>{{::loc.BP_NEXT_INVOICE}}<span> {{::moment(nextInvoiceDate).format(\'MMMM D\')}}</span></h4>',
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
          $scope.moment = moment;
        }]
      };
    }]);
})();