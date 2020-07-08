/**
 * @description
 * Directive for the paid component showing a Member is fully paid.
 *
 * @example
 * <paid-component></paid-component>
 */
(function() {
  'use strict';
  angular
    .module('blueconnect.mobile.directives.paidComponent', [])
    .directive('paidComponent', [
      function() {
        return {
          restrict: 'E',
          replace: true,
          scope: false,
          templateUrl: 'partials/paid-component.html'
        };
      }
    ]);
})();