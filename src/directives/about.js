/**
 * Directive for the about page.
 *
 * @namespace Directives
 * @class about
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.about', [])
  .directive('about', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/about.html',
        scope: {
          /**
          * Display information for the about page.
          *
          * @memberof about
          * @member {Object} aboutDetails
          */
          aboutDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          'config',
          function($rootScope, $scope, adobeService, config) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.appVersion = $rootScope.appVersion;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;

            /**
             * Returns the current environment, if not PROD.
             *
             * @memberof aboutDetails
             * @method getEnvironment
             * @return {String} The environment name.
             */
            $scope.getEnvironment = function() {
              if(config.env === 'PROD') {
                return '';
              }

              return config.env;
            };

            /**
             * Toggles the expansion of an accordion item.
             *
             * @memberof about
             * @method toggleItem
             */

              $scope.toggleItem = function(item, id) {
                for(var i = 0; i < $scope.aboutDetails.content.length; i++) {
                  if (i != id) {
                    $scope.aboutDetails.content[i].expandedDiv = false;
                  }
                }
                item.expandedDiv = !item.expandedDiv;
              };
          }
        ]
      };
    }
  ]);
}());
