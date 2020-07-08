(function() {
  angular
    .module('blueconnect.mobile.directives.homeCardBillingError', [])
    .directive('homeCardBillingError', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/home-card-billing-error.html',
        scope: {
          planDetails: '<',
          error: '<'
        },
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
          $scope.gotoView = $rootScope.gotoView;
          console.warn('Error retrieving home card billing data', $scope.error);
        }]
      };
    });
})();