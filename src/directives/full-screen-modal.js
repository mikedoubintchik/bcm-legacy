/**
 * Directive for the reusable full screen modal.
 *
 * @namespace Directives
 * @class fullScreenModal
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.fullScreenModal', [])
  .directive('fullScreenModal', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'help/full-screen-modal.html',
        scope: false,
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {

            /**
             * Cancel button for full screen modal
             *
             * @memberof fullScreenModal
             * @method cancel
             */
            $scope.fullScreenCancel = function () {
              angular.element('.full-screen-modal').modal('hide');
              $rootScope.blurContent = false;

              angular.element('.navbar').toggleClass('blur',false);
            };

          }
        ]
      };
    }
  ]);
}());
