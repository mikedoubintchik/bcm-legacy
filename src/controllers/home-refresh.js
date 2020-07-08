/**
 * Controller to refresh the home page.
 *
 * @namespace Controllers
 * @class HomeRefreshController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.homeRefresh', [])
  .controller('HomeRefreshController', [
    '$scope',
    '$rootScope',
    function($scope, $rootScope) {
      $rootScope.gotoView('/home');
    }
  ]);
}());
