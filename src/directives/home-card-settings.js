/**
 * Directive for the security settings card on the home screen.
 *
 * @namespace Directives
 * @class homeCardSettings
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardSettings', [])
  .directive('homeCardSettings', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-settings.html',
        scope: {
          /**
          * Display information for the security settings
          *
          * @memberof homeCardSettings
          * @member {Object} settings
          */
          settings: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'cordovaService',
          function($scope, $rootScope, cordovaService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;

            cordovaService.checkDeviceType();
            $scope.iphone = $rootScope.iphone;
            $scope.android = $rootScope.android;

            $scope.authType = $rootScope.touchIdAvailable;

            $scope.showHomeCardSettings = $rootScope.touchIdAvailable && !$rootScope.appSettings.login.useTouchId;

          }
        ]
      };
    }
  ]);
}());
