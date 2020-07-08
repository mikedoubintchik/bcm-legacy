/**
 * Directive for a dental-only-info.
 *
 * @namespace Directives
 * @class dentalOnlyInfo
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.dentalOnlyInfo', [])
  .directive('dentalOnlyInfo', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/dental-only-info.html',
        scope: {
          /**
          * The title of the dental-only-info.
          *
          * @memberof dentalOnlyInfo
          * @member {String} title
          */
          data: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'shareService',
          'adobeService',
          function($scope, $rootScope, shareService, adobeService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.openInSecureBrowser = $rootScope.openInSecureBrowser;
            $scope.trackAction = $rootScope.trackAction;


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
