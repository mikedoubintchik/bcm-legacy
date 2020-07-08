/**
 * Directive for the details box on the id card details page.
 *
 * @namespace Directives
 * @class idCardMemberDetails
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCardMemberDetails', [])
  .directive('idCardMemberDetails', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/id-card-member-details.html',
        scope: {
          /**
          * The id card details to display.
          *
          * @memberof idCardMemberDetails
          * @member {Object} details
          */
          memberDetails: '='
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
