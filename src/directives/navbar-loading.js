/**
 * Directive for the navbar loading spinner.
 *
 * @namespace Directives
 * @class navbarLoading
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.navbarLoading', [])
  .directive('navbarLoading', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/navbar-loading.html',
        scope: false
      };
    }
  ]);
}());
