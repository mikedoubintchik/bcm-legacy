/**
 * Directive for the login page bottom bar.
 *
 * @namespace Directives
 * @class loginBottomBar
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.loginBottomBar', [])
  .directive('loginBottomBar', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/login-bottom-bar.html',
        scope: false,
        controller: [
          '$scope',
          '$rootScope',
          'languageService',
          function($scope, $rootScope, languageService) {
            $scope.gotoView = $rootScope.gotoView;
            if (!$rootScope.language) {
              $rootScope.setLanguage(languageService.getDefaultLanguage());
            }

            /**
             * @description Toggles the language between English and Spanish.
             * @memberof loginBottomBar
             * @method toggleLanguage
             */
            $scope.toggleLanguage = function() {
              $rootScope
                .setLanguage($rootScope.language === 'en' ? 'es' : 'en')
                .then(function(lang) {
                  $scope.loc = $rootScope.getInternalLocale(lang);
              });
            };

          }
        ]
      };
    }
  ]);
}());
