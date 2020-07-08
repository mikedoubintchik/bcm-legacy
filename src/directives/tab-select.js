/**
 * Directive for the tab select element.
 *
 * @namespace Directives
 * @class tabSelect
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.tabSelect', [])
  .directive('tabSelect', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/tab-select.html',
        scope: {
          /**
          * Display information for a tab select element.
          *
          * @memberof tabSelect
          * @member {Object} inboxDetails
          */
          tabs: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$httpParamSerializer',
          function($scope, $rootScope, $location, $httpParamSerializer) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;

            /**
             * Navigates to a view when a tab is clicked.
             *
             * @memberof tabSelect
             * @method tabToView
             */
            $scope.tabToView = function(url) {
              $rootScope.gotoView(url + '?' + $httpParamSerializer($location.search()));
            };
          }
        ]
      };
    }
  ]);
}());
