/**
 * Directive for the card on the home screen for information in other languages card.
 *
 * @namespace Directives
 * @class homeCardOtherLanguagesCard
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardOtherLanguages', [])
  .directive('homeCardOtherLanguages', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-other-languages.html',
        scope: {
          /**
          * Display information for the information in other languages card
          *
          * @memberof homeCardIdCard
          * @member {Number}
          */
          otherLanguages: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.trackAction = $rootScope.trackAction;
            /**
             * Checks the link if it has http:// and https://
             * We want to open the link in a browser or in a local view
             *
             * @memberof homeCardNewsUpdate
             * @method handleLink
             */
            $scope.handleLink = function(link) {
              var url = link;

              if(url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
                return $rootScope.openInBrowser(url);
              } else {
                return $rootScope.gotoView(url);
              }
            };
          }
        ]
      };
    }
  ]);
}());
