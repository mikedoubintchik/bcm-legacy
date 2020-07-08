/**
 * Directive for the basic-navbar.
 *
 * @namespace Directives
 * @class basicNavbar
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.basicNavbar', [])
  .directive('basicNavbar', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/basic-navbar.html',
        scope: {
          /**
          * Information for drawing the basic-navbar.
          *
          * @memberof basicNavbar
          * @member {Object} navbarDetails
          * @param {Object} navbarDetails
          * @param {string} navbarDetails.title
          * @param {Object} navbarDetails.leftNavButton
          * @param {string} navbarDetail.leftNavButton.icon ['back']
          * @param {function} leftClick
          * @param {function} rightClick
          */
          navbarDetails: '=',
          leftClick: '&',
          rightClick: '&'
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            /**
             * Passes left button click action to page scope.
             * We want to disable the buttons if a message is being sent from Inbox
             *
             * @memberof basicNavbar
             * @method onLeftClick
             */
            $scope.onLeftClick = function() {
              if ($rootScope.messageSending) {
                return;
              } else if ($rootScope.sendFaqMessage) {
                $rootScope.sendFaqMessage = false;
                $rootScope.gotoView('/help');
              }else if(!$rootScope.blurContent){
                $scope.leftClick();
              }
            };

            /**
             * Passes right button click action to page scope.
             * We want to disable the buttons if a message is being sent from Inbox
             *
             * @memberof basicNavbar
             * @method onRightClick
             */
            $scope.onRightClick = function() {
              if ($rootScope.messageSending) {
                return;
              } else {
                $scope.rightClick();
              }
            };
          }
        ]
      };
    }
  ]);
}());
