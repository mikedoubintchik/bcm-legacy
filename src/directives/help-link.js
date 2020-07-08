/**
 * Directive for a clickable help icon that opens the help modal.
 *
 * @namespace Directives
 * @class helpIcon
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.helpLink', [])
  .directive('helpLink',  ['$compile', 
    function($compile) {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/help-link.html',
        scope: {
          /**
          * The filename of the help content.
          *
          * @memberof helpIcon
          * @member {String} fileName
          */
          fileName: '=',
          item: '=',
          data: '='
        },
        link: function  (scope, element, attr) {
          scope.$watch(
            function(scope) {
              // watch the 'compile' expression for changes
              return scope.$parent.$eval(attr.data);
            },
            function(value) {
              var perferred  = scope.loc.FAMILYGRAPH_FAMILYSUMMARY_PREFERREDCARE_LABEL;
              var standard = scope.loc.FAMILYGRAPH_FAMILYSUMMARY_STANDARDCARE_LABEL;
              value = value.replace(perferred, "<A ng-click='showHelp()'>" + perferred + "</A>");
              value = value.replace(standard, "<A ng-click='showHelp()'>" + standard + "</A>");              
              // when the 'compile' expression changes
              // assign it into the current DOM
              element.html(value);
              console.log(value);
              // compile the new DOM and link it to the current
              // scope.
              // NOTE: we only compile .childNodes so that
              // we don't get into infinite loop compiling ourselves
              $compile(element.contents())(scope);
            }
          );
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
            };
          }
        ]
      };
    }
  ]);
}());
