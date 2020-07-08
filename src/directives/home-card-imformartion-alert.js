/**
 * Directive for the info homeCardInformationAlert card on the home screen.
 *
 * @namespace Directives
 * @class homeCardInformationAlert
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardInformationAlert', [])
  .directive('homeCardInformationAlert', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-information-alert.html',
        scope: {
          /**
          * Display information for the info alert
          *
          * @memberof homeCardInformationAlert
          * @member {Object} informationDetails
          */
          informationDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            /**
             *Display the alert window for external link to open the url in browser
            **/
            $scope.openInBrowser = $rootScope.openInBrowser;
          }
        ]
      };
    }
  ]);
}());
