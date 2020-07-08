/**
 * Directive for a clickable help icon that opens the help modal.
 *
 * @namespace Directives
 * @class helpIcon
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.helpIcon', [])
  .directive('helpIcon', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/help-icon.html',
        scope: {
          /**
          * The filename of the help content.
          *
          * @memberof helpIcon
          * @member {String} fileName
          */
          fileName: '=',
          item: '=',
          data: '=',
          header: '='
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
            $scope.showHelp = function() {
              helpService.showHelp($scope.fileName, $scope.data);
              $rootScope.headerTerm = $scope.header;
            };
          }
        ]
      };
    }
  ]);
}());
