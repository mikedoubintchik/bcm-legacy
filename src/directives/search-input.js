/**
 * Directive for a standalone search input.
 *
 * @namespace Directives
 * @class searchInput
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.searchInput', [])
  .directive('searchInput', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/search-input.html',
        scope: false,
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          function($scope, $rootScope, $location) {
            $scope.loc = $rootScope.loc;

            /**
            * The query string to search by.
            *
            * @memberof searchInput
            * @member {String} query
            */
            $scope.query = $location.search().q || '';

            /**
             * Focuses on the search input.
             *
             * @memberof searchInput
             * @method focusOnSearchInput
             */
            $scope.focusOnSearchInput = function() {
              angular.element('.search-input input').focus();
            };

            /**
             * Validates the query string.
             *
             * @memberof searchInput
             * @method queryIsValid
             */
            $scope.queryIsValid = function() {
              if($scope.query.length < 3) {
                return false;
              }
              if($scope.query === $location.search().q) {
                return false;
              }

              return true;
            };

            /**
             * Performs the search.
             *
             * @memberof searchInput
             * @method search
             */
            $scope.search = function() {
              $scope.hideKeyboard();
              if(!$scope.queryIsValid()) {
                return;
              }
              $location.url($location.path() + '?q=' + $scope.query);
            };
          }
        ]
      };
    }
  ]);
}());
