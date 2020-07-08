/**
 * Directive for a clickable help icon that opens the help modal.
 *
 * @namespace Directives
 * @class dynamicHelpIcon
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.dynamicHelpIcon', [])
  .directive('dynamicHelpIcon', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/dynamic-help-icon.html',
        scope: {
          /**
          * The filename of the help content.
          *
          * @memberof helpIcon
          * @member {String} fileName
          */
          info : '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'helpService',
          function($scope, $rootScope, helpService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            /**
            * Call the helpService to display relative information
            * that might be helpful to the user
            *
            * @memberof helpIcon
            * @method showHelp
            * @param  {String} filename The name of the helpfile to load.
            */
            $scope.help = function(info) {
              helpService.help(info);
            };
          }
        ]
      };
    }
  ]);
}());
