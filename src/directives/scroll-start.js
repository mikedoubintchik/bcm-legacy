/**
 * Directive for the id card scroll div start.
 *
 * @namespace Directives
 * @class idCardScrollStart
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.scrollStart', [])
  .directive('scrollStart', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/scroll-start.html',
      };
    }
  ]);
}());
