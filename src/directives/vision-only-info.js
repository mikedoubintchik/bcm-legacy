/**
 * Directive for a vision-only-info.
 *
 * @namespace Directives
 * @class visionOnlyInfo
 */
(function() {
    'use strict';
  
    angular.module('blueconnect.mobile.directives.visionOnlyInfo', [])
    .directive('visionOnlyInfo', [
      function() {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/vision-only-info.html',
          scope: {
            /**
            * The title of the vision-only-info.
            *
            * @memberof visionOnlyInfo
            * @member {String} title
            */
           visionBenefitsData: '='
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
              $scope.footnotesBottom = $scope.visionBenefitsData[3].showFullText;
              $scope.visionPlan = $rootScope.selectedPolicy.visionPlan;
  
              document.addEventListener("deviceready", onDeviceReady, false);
  
              $scope.toggleItem = function() {
                if ($scope.expandedDiv){
                  $scope.expandedDiv = true;
                  $scope.footnotesBottom = $scope.visionBenefitsData[3].showFullText;
                } else {
                  $scope.footnotesBottom = $scope.visionBenefitsData[3].hideFullText;
                }
  
                $scope.expandedDiv = !$scope.expandedDiv;
              };
  
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
                };
              }
            }
          ]
        };
      }
    ]);
  }());