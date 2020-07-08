/**
 * Directive for the inbox message search screen.
 *
 * @namespace Directives
 * @class inboxMessageSearch
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.inboxSearch', [])
  .directive('inboxSearch', [
    function() {

      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/inbox-search.html',
        scope: false,
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
