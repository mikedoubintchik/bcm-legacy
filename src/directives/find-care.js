/**
 * Directive for the findCare.
 *
 * @namespace Directives
 * @class findCare
 */
(function () {
    'use strict';
  
    angular.module('blueconnect.mobile.directives.findCare', [])
        .directive('findCare', ['$http', 'config',
          function ($http, config) {
            return {
              restrict: 'E',
              replace: true,
              templateUrl: 'partials/find-care.html',
              scope: {
                findCareDetails: '=',
                plans: '=',
              },
              controller: [
                '$scope',
                '$rootScope',
                '$location',
                '$http',
                '$anchorScroll',
                'languageService',
                'TransparencyFactory',
                'config',
                'geoLocationService',
                '$timeout',
                function ($scope, $rootScope, $location, $http, $anchorScroll, languageService, TransparencyFactory, config, geoLocationService, $timeout) {
                  $scope.language = $rootScope.language || 'en';
                  languageService.getLocale($scope.language).then(function(localeReturned) {
                    $scope.loc = localeReturned;
                  }).catch(console.warn);

                  $scope.gotoPlanSearchDetails = function(plan) {
                    $rootScope.selectedPlan = plan;
                    TransparencyFactory.setSelectedPlan(plan);
                    $rootScope.selectedUnauthenticatedPlanName = plan.name;
                    $rootScope.gotoView('/find-doctor-search');
                  };
                }
              ]
            };
          }
        ]);
  }());
  