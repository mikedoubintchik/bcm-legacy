/**
 * Services for the back button.
 *
 * @namespace Services
 * @class backButtonService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.backButton', [])
  .service('backButtonService', [
    '$rootScope',
    '$location',
    'TransparencyFactory',
    function($rootScope, $location, TransparencyFactory) {
      this.backButtonFunction = function() {
        $rootScope.resultsTermsArr = [];
        $rootScope.filtersDataArr = [];
        $rootScope.resultsDetailsTermArr = [];
        $rootScope.$on('$locationChangeStart', function () {
          // Skip fiter page
          if ($location.path() === '/find-doctor-filter') {
            if (!$rootScope.newFilter) {
              $rootScope.filtersDataArr.shift();
              var filtersData = $rootScope.filtersDataArr[0] || '';
              TransparencyFactory.setFilterTierSelectedTerm(filtersData.tierData || '');
              TransparencyFactory.setFilterSpecialtySelectedTerm(filtersData.specialty || '');
              TransparencyFactory.setFilterGenderSelectedTerm(filtersData.gender || '');
  
              window.history.back();
            } else {
              $rootScope.newFilter = false;
            }
          }
        });
  
        $rootScope.$on('$locationChangeSuccess', function () {
          // Track previous URL for go-back button
          var args = Array.prototype.slice.call(arguments);
          if (!$rootScope.routes) {
            $rootScope.routes = {
              current: args[1],
              previous: args[2],
              history: args.slice(1, 2)
            };
          } else {
            if (!/find-doctor-filter/.test(args[1])) {
              $rootScope.routes = {
                current: args[1],
                previous: args[2],
                history: $rootScope.routes.history.concat([args[1]])
              };
            }
          }
          if ($rootScope.routes && $rootScope.routes.history.length > 7) {
            $rootScope.routes.history = $rootScope.routes.history.slice(1);
          }
          // End of Track previous URL for go-back button
  
          if ($location.path() === '/find-doctor-browser') {
            // reset fromBackButton to false
            if ($rootScope.fromBackButton) {
              $rootScope.fromBackButton = false;
            }
          }
  
          if ($location.path() === '/find-doctor-search-results') {
            if ($rootScope.fromBackButton) {
              $rootScope.fromBackButton = false;
            } else {
              $rootScope.resultsTermsArr.unshift(TransparencyFactory.getResultsTerm());
            }
          }
  
          if ($location.path() === '/find-doctor-results-details') {
            if ($rootScope.detailsFromBackButton) {
              $rootScope.detailsFromBackButton = false;
            } else {
              $rootScope.resultsDetailsTermArr.unshift(TransparencyFactory.getResultsDetailsTerm());
            }
          }
  
          // reset fromBackButton to false
          if (!$rootScope.loggedIn && $location.path() === '/find-doctor-search') {
            $rootScope.fromBackButton = false;
            $rootScope.detailsFromBackButton = false;
          }
  
          // reset history arrays & fromBackButton to initial values
          if ((!$rootScope.loggedIn && $location.path() === '/login') || 
              ($rootScope.loggedIn && $location.path() === '/home') || 
              ($rootScope.loggedIn && $location.path() === '/find-doctor-search')) {
            $rootScope.resultsTermsArr = [];
            $rootScope.filtersDataArr = [];
            $rootScope.resultsDetailsTermArr = [];
            $rootScope.fromBackButton = false;
            $rootScope.detailsFromBackButton = false;
          }
        });
      };
    }
  ]);
}());