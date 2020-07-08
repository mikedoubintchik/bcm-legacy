/**
 * Controller for the network Landing Local page view.
 *
 * @namespace Controllers
 * @class NetworkLandingLocalController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.networkLandingLocal', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('NetworkLandingLocalController', [
            '$scope',
            '$rootScope',
            '$window',
            function($scope, $rootScope, $window) {
                $rootScope.showNav = false;
                $rootScope.showPolicySelect = false;

                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {

                  document.addEventListener("online", onOnline, false);

                  function onOnline(){
                      angular.element('.page-no-connection').hide();
                      angular.element('.login-bottom-bar').css('margin-bottom', 0);
                      angular.element('.navbar-menu-bottom').css('margin-bottom', 0);
                    $window.history.go(-2);
                  }
                }
            }
        ]);
}());
