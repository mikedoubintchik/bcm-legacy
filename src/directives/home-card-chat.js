/**
 * Directive for the about page.
 *
 * @namespace Directives
 * @class about
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homecardChat', [])
  .directive('homeCardChat', ['livechatService',
    function(livechatService) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-chat.html',
        scope: {
          /**
          * Display information for the about page.
          *
          * @memberof about
          * @member {Object} aboutDetails
          */
          chatDetails: '=',
          liveChatDetails: '='
        },
        controller: [
          '$rootScope',
          '$scope',
          'adobeService',
          'config',
          '$timeout',
          '$location',
          function($rootScope, $scope, adobeService, config, $timeout, $location) {
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.loc = $rootScope.loc;
            $scope.chatButtons = livechatService.getChatButtons();
            var mergedResponse = null;
            var chatAvailableBtns = document.getElementById("live-chat-available-button");
            var chatNotAvailableBtns = document.getElementById("live-chat-not-available-button");

            var url = $rootScope.loggedIn ? config.apiUrl : config.capraApiUrl;

            var liveChatObject = $scope.liveChatDetails;
            var liveChatMemberDetailsObject = liveChatObject.livechatDetailsObject;

            $.post(url + '/livechat', liveChatObject).then(function(result) {
              if (result.dateOfBirth && /\d{8}/.test(result.dateOfBirth)) {

                if (parseInt(result.dateOfBirth.slice(0,2)) < 13) {

                  result.dateOfBirth = [
                    result.dateOfBirth.slice(0,2),
                    result.dateOfBirth.slice(2,4),
                    result.dateOfBirth.slice(4,8)
                    ].join('-');
                }
            }
            liveChatMemberDetailsObject.result = result;
            mergedResponse = angular.extend({}, liveChatMemberDetailsObject.member, liveChatMemberDetailsObject.result);

            if (!window.liveagent) {
              livechatService.reloadLivechat();
              $rootScope.liveChatIntialized = false;
            }
            if (!$rootScope.liveChatIntialized) {
              $rootScope.liveChatIntialized = true;
              if (!window._laq) {
                window._laq = [];
              }

              $timeout(function() {
                window._laq.push(function () {
                  window.liveagent.showWhenOnline($scope.chatButtons[0].token, chatAvailableBtns);
                  window.liveagent.showWhenOffline($scope.chatButtons[0].token, chatNotAvailableBtns);
                });
                
                window.liveagent.init.apply(null, config.liveagent.authInit);
                angular.forEach(mergedResponse, function (value, key) {
                  try {
                    window.liveagent.addCustomDetail(key, value + '');
                  } catch (error) {
                    console.log("error live chat" + error);
                  }
                });

                window.liveagent.addButtonEventHandler($scope.chatButtons[0].token, btnEventHandler);
              }, 1000);
            }
          });
            function btnEventHandler(e){
              if (e == window.liveagent.BUTTON_EVENT.BUTTON_AVAILABLE){
                $rootScope.livechat = { value: true };
                if ($location.path() === '/help') {
                  $rootScope.$apply();
                }
              } else if (e == window.liveagent.BUTTON_EVENT.BUTTON_UNAVAILABLE){
                $rootScope.livechat = { value: false };
                if ($location.path() === '/help') {
                  $rootScope.$apply();
                }
              }
            }

            $scope.startChat = function (buttonToken) {
              livechatService.openChat(buttonToken);
            };
            $scope.liveChatAlert = function () {
              livechatService.alert();
            };           
          }
        ]
      };
    }
  ]);
}());