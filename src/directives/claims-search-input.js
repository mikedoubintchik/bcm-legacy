/**
 * Directive for claims search input.
 *
 * @namespace Directives
 * @class claimsSearchInput
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimsSearchInput', [])
  .directive('claimsSearchInput', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claims-search-input.html',
        scope: true,
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          'claimsService',
          'coachmarkService',
          function($scope, $rootScope, $location, claimsService, coachmarkService) {

            $scope.loc          = $rootScope.loc;
            $scope.policyIndex  = $rootScope.policyIndex;

            if ($rootScope.hasClaims) {
              coachmarkService.showCoachmarks('claims');
            }

            /**
            * The query string to search by.
            *
            * @memberof claimsSearchInput
            * @member {String} query
            */
            $scope.query        = $location.search().keyword || '';
            $scope.searchParams = $location.search() || '';

            /**
             * Focuses on the search input.
             *
             * @memberof claimsSearchInput
             * @method focusOnSearchInput
             */
            $scope.focusOnSearchInput = function() {
              angular.element('.search-input input').focus();
            };

            /**
             * Validates the query string.
             *
             * @memberof claimsSearchInput
             * @method queryIsValid
             */
            $scope.queryIsValid = function() {
              if($scope.query.length < 3) {
                return false;
              }
              if(($scope.query === $location.search().keyword) && ($scope.policyIndex === $rootScope.policyIndex)) {
                return false;
              }

              return true;
            };

            $scope.filterResults = function(query) {
              if (query) {
                $rootScope.gotoView('/claims/filter?keyword='+query);
              }
              else {
                $rootScope.gotoView('/claims/filter');
              }
            };

            /**
             * Performs the search.
             *
             * @memberof claimsSearchInput
             * @method search
             */
            $scope.search = function() {
              $scope.hideKeyboard();
              if(!$scope.queryIsValid()) {
                return;
              }

              var basicSearch = claimsService.generateFilterQuery($location.search().dependentNo, $scope.searchParams.claimsStatus, $scope.searchParams.startMonth, $scope.searchParams.endMonth, $scope.searchParams.effectiveDate, $scope.searchParams.expirationDate, $scope.query);

              $location.url($location.path() + '?' + basicSearch);
            };
          }
        ]
      };
    }
  ]);
}());
