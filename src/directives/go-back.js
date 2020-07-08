/**
 * Directive for an element to go back a screen on click.
 *
 * @namespace Directives
 * @class goBack
 */
angular.module('blueconnect.mobile.directives.goBack', [])
.directive('goBack', ['$rootScope','$window', '$location', '$timeout', 'TransparencyFactory', '$route', function($rootScope, $window, $location, $timeout, TransparencyFactory, $route) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      elem.on('click', function(event) {       
        $rootScope.fromBackButton = false;
        $rootScope.detailsFromBackButton = false;
        if ($rootScope.sentMessage || $rootScope.cliamSendMessage) {
          $window.history.go(-4);
          $rootScope.sentMessage= false;
          $rootScope.cliamSendMessage = false;
        } else if ($location.path() === '/find-doctor-search' || 
        $location.path() === '/find-doctor' || 
        $location.path() === '/find-doctor-browser') {
          $rootScope.fromBackButton = true;
          $rootScope.detailsFromBackButton = true;
          $rootScope.openMapView = false;
          $window.history.back();
        } else if ($location.path() === '/find-doctor-search-results') {
          $rootScope.resultsTermsArr.shift();
          TransparencyFactory.setResultsTerm($rootScope.resultsTermsArr[0]);
          $rootScope.fromBackButton = true;
          $rootScope.detailsFromBackButton = true;
          $window.history.back();
        } else if ($location.path() === '/find-doctor-results-details') {
          $rootScope.resultsDetailsTermArr.shift();
          TransparencyFactory.setResultsDetailsTerm($rootScope.resultsDetailsTermArr[0]);
          $rootScope.fromBackButton = true;
          $rootScope.detailsFromBackButton = true;
          $rootScope.openMapView = ($rootScope.OpenDetailsPageFromMapView === 'map') ? true : false;
          $window.history.back();
        } else if($rootScope.openFindCare && $location.path() === '/find-care'){
          $rootScope.openFindCare = false;
          $window.history.go(-2);
        }else {
          $window.history.back();
        }
      });
    }
  };
}]);
