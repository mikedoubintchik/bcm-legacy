(function() {
  angular
    .module('blueconnect.mobile.directives.billingServiceDown', [])
    .directive('billingServiceDown', function() {
      return {
        template: '<p ng-bind="::loc.ERROR_HOME_BP"></p>',
        controller: ['$rootScope', '$scope', function() {
          $scope.loc = $rootScope.loc;
        }]
      };
    });
})();