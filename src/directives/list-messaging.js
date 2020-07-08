/**
 * Directive for a list messaging window.
 *
 * @namespace Directives
 * @class listMessaging
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.listMessaging', [])
  .directive('listMessaging', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/list-messaging.html',
        scope: {
          /**
          * The title of the list messaging window
          *
          * @memberof listMessaging
          * @member {String} title
          * @member {Boolean} pageName
          */
          title: '=',
          pageName: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.isComponent = $scope.pageName ? true : false;
          }
        ]
      };
    }
  ]);
}());
