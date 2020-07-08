/**
 * Directive for the id card page.
 *
 * @namespace Directives
 * @class idCard
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCard', [])
  .directive('idCard', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/id-card.html',
        scope: {
          /**
          * Display information for the id card page.
          *
          * @memberof idCard
          * @member {Object} idCardDetails
          */
          idCardDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'coachmarkService',
          'shareService',
          'helpService',
          function($rootScope, $scope, coachmarkService, shareService, helpService) {
            $scope.loc = $rootScope.loc;
            $scope.itemIndex = 0;
            $scope.images =[];
            $scope.isFlipped = false;
            $scope.mimeType =  $scope.idCardDetails.image[1].mimeType;
            $scope.trackAction = $rootScope.trackAction;

            for(var j=0; j < $scope.idCardDetails.image[0].img.length; j++) {
              for(var i = 0; i < $scope.idCardDetails.image[0].img[j].document.length; i++) {
                 if ($scope.idCardDetails.image[0].img[j].document[i].documentTypeCode === "ID_IMG_F") {
                   $scope.imageFront = $scope.idCardDetails.image[1].mimeType + ',' +$scope.idCardDetails.image[0].img[j].document[i].documentImageBlob;
                 }
                 if ($scope.idCardDetails.image[0].img[j].document[i].documentTypeCode === "ID_IMG_B") {
                   $scope.imageBack = $scope.idCardDetails.image[1].mimeType + ',' +$scope.idCardDetails.image[0].img[j].document[i].documentImageBlob;
                 }
               }
               $scope.images.push({'imageFront':$scope.imageFront, 'imageBack': $scope.imageBack, 'index' : j});
            }


            if ($scope.idCardDetails.image[0].img.length) {
              coachmarkService.showCoachmarks('id-card');
            }

            $scope.buttons = [];

            for(var k=0; k< $scope.idCardDetails.buttons.length; k++){
              $scope.buttons.push(
                {
                'title' : $scope.idCardDetails.buttons[k].title,
                'title1' : $scope.idCardDetails.buttons[k].title1,
                'icon' :  $scope.idCardDetails.buttons[k].icon
              });
            }

            $rootScope.shareIdCard = function() {
              //This is WRONG. Only for poc'ing share
              var shareContent;
              var canvas = document.createElement( "canvas" );
              var ctx = canvas.getContext( "2d" );
              var img = document.createElement( "img" );
              canvas.width = "765.69";
              canvas.height = "482.35";

              if($scope.mimeType === 'data:image/svg+xml;base64') {
                if(!$scope.isFlipped){
                  img.setAttribute( "src", $scope.images[$scope.itemIndex].imageFront );
                }else {
                  img.setAttribute( "src", $scope.images[$scope.itemIndex].imageBack );
                }
                img.onload = function() {
                  ctx.drawImage( img, 0, 0 );
                  shareService.showSharing(shareService.contentType.FILES, canvas.toDataURL( "image/png" ) );
                };
              } else {
                if(!$scope.isFlipped){
                  shareContent = $scope.images[$scope.itemIndex].imageFront;
                }else {
                  shareContent = $scope.images[$scope.itemIndex].imageBack;
                }
                shareService.showSharing(shareService.contentType.FILES, shareContent);
              }
            };

            $scope.imageLength = $scope.images.length - 1;

            /**
            * This method used to if the user has multiple images to go to next image.
            *
            * @memberof idCard
            * @method goNextImage
            */

            $scope.goNextImage = function(index) {
              if(index < 0) {
                index = 0;
              }
              if(index > ($scope.images.length-1)) {
                index = ($scope.images.length-1);
              }

              $scope.itemIndex = index;
              var left = index * -75;
              angular.element('.setup-idcard').animate({'width': 100 + '%'}, 125);
              angular.element('.setup-idcard').animate({ 'margin-left' : left + '%'}, 125);
            };

            /**
            * This method used to display the image by returning style margin-left
            *
            * @memberof idCard
            * @method displayImage
            */

            $scope.displayImage = function(index){
              var leftMargin = 0;
              if (index > 0) {
                leftMargin = index * 75;
              }
              console.log(leftMargin + '%');
              return {
                'margin-left' : leftMargin + '%'
              }
            }

            /**
            * This method used to full screen the image.
            *
            * @memberof idCard
            * @method openFullScreen
            */

            $scope.openFullScreen = function(index){
              if(!$scope.isFlipped){
                helpService.imageFullScreen($scope.images[index].imageFront);
              }else{
                helpService.imageFullScreen($scope.images[index].imageBack);
              }
            };

            /**
            * This method used to flip the image back to front.
            *
            * @memberof idCard
            * @method flipCard
            */

            $scope.flipCard = function(index) {
              if($scope.isFlipped){
                $scope.isFlipped = false;
              }else {
                $scope.isFlipped = true;
              }
            };
          }
        ]
      };
    }
  ]);
}());
