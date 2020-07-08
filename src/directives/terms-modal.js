/**
 * Directive for the reusable terms modal.
 *
 * @namespace Directives
 * @class termsModal
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.termsModal', [])
    .directive('termsModal', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'help/terms-modal.html',
          scope: false,
          controller: [
            '$rootScope',
            '$scope',
            function($rootScope, $scope) {
              $scope.trackAction = $rootScope.trackAction;


              /**
               * goBack button for terms modal
               *
               * @memberof termsModal
               * @method goBack
               */
              $scope.goBack = function() {
                angular.element('.terms-modal').modal('hide');
                $rootScope.blurContent = false;

                angular.element('.navbar').toggleClass('blur', false);
              };

            }
          ]
        };
      }
    ]);
}());
