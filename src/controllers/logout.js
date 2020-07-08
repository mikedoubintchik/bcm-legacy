/**
 * Logs a member out of the app.
 *
 * @namespace Controllers
 * @class LogoutController
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.controllers.logout', [])
  .controller('LogoutController', [
    '$scope',
    '$rootScope',
    function($scope, $rootScope) {
      $rootScope.logOut();
    }
  ]);
}());
