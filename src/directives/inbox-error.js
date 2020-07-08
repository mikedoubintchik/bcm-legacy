(function() {
  angular.module('blueconnect.mobile.directives.inboxError', [])
  .directive('inboxError', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/inbox-error.html',
      controller: ['$rootScope', '$scope', function($rootScope, $scope) {
        $scope.loc = $rootScope.loc;
      }]
    };
  });
})();