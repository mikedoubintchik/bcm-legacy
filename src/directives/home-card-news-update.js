/**
 * Directive for the news update card on the home screen.
 *
 * @namespace Directives
 * @class homeCardNewsUpdate
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardNewsUpdate', [])
  .directive('homeCardNewsUpdate', [
    function(newsService) {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-news-update.html',
        scope: {
          /**
          * Display information for the news update
          *
          * @memberof homeCardNewsUpdate
          * @member {Object} newsDetails
          */
          newsDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'adobeService',
          function($scope, $rootScope, adobeService) {
            $scope.loc = $rootScope.loc;
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;
            /**
             * Checks the link if it has http:// and https://
             * We want to open the link in a browser or in a local view
             *
             * @memberof homeCardNewsUpdate
             * @method handleLink
             */
            $scope.handleLink = function() {
              var url = $scope.newsDetails.link;

              if(url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
                return $scope.openInBrowser(url);
              } else {
                return $scope.gotoView(url);
              }
            };
          }
        ]
      };
    }
  ]);
}());
