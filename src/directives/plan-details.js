(function() {
  angular
    .module('blueconnect.mobile.directives.planDetails', [])
    .directive('planDetails', function() {
      return {
        restrict: 'E',
        scope: {
          /**
           * @param {object} policy
           * @param {Array} policy.policyMembers
           * @param {string} policy.policyMembers[x].givenName
           * @param {string} policy.alphaPrefix
           * @param {string} policy.eternalId
           */
          policy: '<'
        },
        templateUrl: 'partials/plan-details.html',
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
          $scope.loc = $rootScope.loc;
        }]
      };
    });
})();