/**
 * Directive for a help item group on the help page.
 *
 * @namespace Directives
 * @class glossaryOfTerms
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.glossaryOfTerms', [])
  .directive('glossaryOfTerms', [
    '$rootScope',
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/glossary-of-terms.html',
        scope: {
          /**
          * Display information for the help item group.
          *
          * @memberof helpItemGroup
          * @member {Object} groupDetails
          */
          data: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$timeout',
          function($scope, $rootScope, $location, $timeout) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;
            
          }
        ]
      };
    }
  ]);
}());
