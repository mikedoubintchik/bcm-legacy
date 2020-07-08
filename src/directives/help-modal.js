/**
 * Directive for the reusable help modal.
 *
 * @namespace Directives
 * @class helpModal
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.helpModal', [])
  .directive('helpModal', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'help/help-modal.html',
        scope: false,
        controller: [
          '$rootScope',
          '$scope',
          function($rootScope, $scope) {
            $scope.trackAction = $rootScope.trackAction;
            

            /**
             * Cancel button for help modal
             *
             * @memberof helpModal
             * @method cancel
             */
            $scope.cancel = function () {
              angular.element('.help-modal').modal('hide');
              $rootScope.blurContent = false;

              angular.element('.navbar').toggleClass('blur',false);
            };

          }
        ]
      };
    }
  ]);
}());
