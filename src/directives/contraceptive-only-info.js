/**
 * Directive for a contraceptive-only-info.
 *
 * @namespace Directives
 * @class contraceptiveOnlyInfo
 */
(function() {
    'use strict';
  
    angular.module('blueconnect.mobile.directives.contraceptiveOnlyInfo', [])
    .directive('contraceptiveOnlyInfo', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/contraceptive-only-info.html',
          scope: {
            /**
            * The title of the contraceptive-only-info.
            *
            * @memberof contraceptiveOnlyInfo
            * @member {String} title
            */
            data: '=',
          },
          controller: [
            '$scope',
            '$rootScope',
            'helpService',
            function($scope, $rootScope, helpService) {
              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;
              $scope.openInBrowser = $rootScope.openInBrowser;
              $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;

              $scope.openModal = function() {
                  $rootScope.headerTerm = $scope.data.modalHeader;
                  $scope.helpInfo = {
                    benefitsModalText: $scope.data.modalText,
                    contraceptiveInfo : true
                  };
                  helpService.help($scope.helpInfo);
              };
            }
          ]
        };
      }
    ]);
  }());
  