/**
 * @description Service for live chat data.
 * @namespace Services
 * @class livechatService
 */
(function() {
  'use strict';

  angular
    .module('blueconnect.mobile.services.livechat', [])
    .factory('livechatService', [
      '$window',
      'config',
      'languageService',
      'policyService',
      '$rootScope',
      'alertService',
      function($window, config, languageService, policyService, $rootScope, alertService) {
        var chatMemberIdentifier = getChatMemberIdentifier();
        var memberInitializedLiveChat = false;
        var chatButtons = config.liveagent.authButtons;
        var url = $rootScope.loggedIn ? config.apiUrl : config.capraApiUrl;

        return {
          memberHasLiveChat: memberHasLiveChat,
          getChatMemberIdentifier: getChatMemberIdentifier,
          getChatButtons: getChatButtons,
          alert: alert,
          openChat: openChat,
          removeLivechat: removeLivechat,
          reloadLivechat: reloadLivechat,
          disconnectLiveChat: disconnectLiveChat,
          registerButton: registerButton,
        };

        function disconnectLiveChat() {
          window.liveagent.disconnect();
          removeLivechat();
        }

        /*remove live agent*/
        function removeLivechat() {
          var scripts = document.getElementsByTagName('script');
          for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src');
            if (src && src.includes('livechatDeployment.js')) {
              scripts[i].remove();
            }
          }

          delete window.liveagent;
          delete window.liveAgentDeployment;
        }

        /* reload the script for live chat*/
        function reloadLivechat() {
          var script= document.createElement('script');
          script.type = 'text/javascript';
          script.src= 'js/livechatDeployment.js';
          $("head").append(script);
        }

        function registerButton(button, index){
          if (index === 1){
            $window.liveagent.showWhenOnline($(button).attr('token'), button, false);
          } else {
            $window.liveagent.showWhenOffline($(button).attr('token'), button, false);
          }
        }

        function openChat(buttonToken) {
          var TIPData = $rootScope.getTIPData();
         
          TIPData.ruid = $rootScope.analyticsInfo.info2;
          TIPData.userId = $rootScope.analyticsInfo.info3;

          $window.liveagent.startChat(buttonToken);
          $.post(url + '/livechatstarted', TIPData);
        };

        function alert(){
          

          var confirm;
          alertService.showAlert(
            $rootScope.loc.LIVE_CHAT_CHAT_NOT_AVAILABLE,
            '<div class="home-card-chat-dialog"><p class="home-card-chat-dialog-heading">' + $rootScope.loc.LIVE_CHAT_CHAT_CURRENTLY_NOT_AVAILABLE + '</p>' + $rootScope.loc.LIVE_CHAT_CHAT_NOT_AVAILABLE_PROMPT + '</div>',
            {
              title: $rootScope.loc.OK
            }, confirm, "dark"
          );
        }

        function memberHasLiveChat() {
          return Boolean(getChatMemberIdentifier());
        }

        function getChatButtons() {
          var language = languageService.getDefaultLanguage();
          if (getChatMemberIdentifier()){
            return chatButtons[getChatMemberIdentifier()][language];
          } else {
            return {};
          }
        }

        function getChatMemberIdentifier() {
          var selectedPolicy = policyService.getSelectedPolicy();
          if (!selectedPolicy) {
            return false;
          }
          if (selectedPolicy.individual && selectedPolicy.sourceSystem.toLowerCase() === 'facets') {
            chatMemberIdentifier = 'iu65';
          }
          if (selectedPolicy.state) {
            chatMemberIdentifier = 'shp';
          }
          if (selectedPolicy.sourceSystem === 'Amisys') {
            chatMemberIdentifier = 'medicare';
          }
          if (
            $rootScope.signature &&
            $rootScope.signature.get($rootScope.policyIndex).isSignatureService
          ) {
            chatMemberIdentifier = 'signature';
          }
          return chatMemberIdentifier;
        }
      }
    ]);
}());