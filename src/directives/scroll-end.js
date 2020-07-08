/**
 * Directive for the id card scroll div end.
 *
 * @namespace Directives
 * @class idCardScrollEnd
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.scrollEnd', [])
  .directive('scrollEnd', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/scroll-end.html',
      };
    }
  ]);
}());
