/**
 * @description Directive for Salesforce-drive live Agent chat.
 * @namespace Directives
 * @class liveChat
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.liveChat', [])
  .directive('liveChat', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/live-chat.html',
        controller: [
          '$scope',
          '$window',
          'config',
          'languageService',
          'livechatService',
          function($scope, $window, config, languageService, livechatService) {
            $scope.liveChatAvailable = false;
            $scope.agentAvailable = false;
            $scope.memberInitializedLiveChat = false;
            $scope.language = languageService.getDefaultLanguage();

            if (!$window.liveagent) {
              $scope.liveChatAvailable = false;
            }

            var liveagent = $window.liveagent;

            if (!config.liveagent) {
              $scope.liveChatAvailable = false;
            }



            $scope.chatButtons = livechatService.getChatButtons();

            $scope.liveChatAvailable = true;
            $scope.initializeChat = init;

            $scope.memberHasLiveChat = livechatService.memberHasLiveChat;

            function init () {
              $scope.memberInitializedLiveChat = true;
              livechatService.init();
            };

            $scope.startChat = function(buttonToken) {
              $window.liveagent.startChat(buttonToken, config.liveagent);
            };
          }
        ],
        controllerAs: 'liveChatCtrl'
      };
    }
  ]);
}());
