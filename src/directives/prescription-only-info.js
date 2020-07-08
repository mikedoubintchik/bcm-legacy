/**
 * Directive for a prescription-only-info.
 *
 * @namespace Directives
 * @class prescriptionOnlyInfo
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.prescriptionOnlyInfo', [])
  .directive('prescriptionOnlyInfo', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/prescription-only-info.html',
        scope: {
          /**
          * The title of the prescription-only-info.
          *
          * @memberof prescriptionOnlyInfo
          * @member {String} title
          */
          data: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'shareService',
          '$window',
          function($scope, $rootScope, shareService, $window) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
            $scope.language = $rootScope.language;

            document.addEventListener("deviceready", onDeviceReady, false);

            function onDeviceReady() {
              var devicePlatform = device.platform;
              $scope.openPDF = function(url){
                if (devicePlatform !== 'iOS') {
                /**
                * Android can not open PDF using openInBrowser
                * Adding google drive prefix link to open PDF in browser
                */
                $rootScope.$emit('pageLoading');
                DocumentViewer.previewFileFromUrlOrPath(
                      function (success) {
                        $rootScope.$emit('pageLoaded');
                    },
                      function (error) {
                        console.log(error);
                        $rootScope.$emit('pageLoaded');
                    },
                    url, 'benefits.pdf');
                } else {
                  $scope.openInBrowser(url);
                }
              }
            }
          }
        ]
      };
    }
  ]);
}());
