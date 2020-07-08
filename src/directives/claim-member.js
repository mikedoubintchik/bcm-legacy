/**
 * Directive for the member box on the claim details page.
 *
 * @namespace Directives
 * @class claimMember
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimMember', [])
  .directive('claimMember', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claim-member.html',
        scope: {
          /**
          * The name of the member.
          *
          * @memberof claimMember
          * @member {String} memberName
          */
          memberName: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
          }
        ]
      };
    }
  ]);
}());
