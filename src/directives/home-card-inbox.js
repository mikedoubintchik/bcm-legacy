/**
 * Directive for the inbox card on the home screen.
 *
 * @namespace Directives
 * @class homeCardInbox
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardInbox', [])
  .directive('homeCardInbox', [
    'messageService',
    function(messageService) {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-inbox.html',
        scope: {
          /**
          * Display information for the inbox card.
          *
          * @memberof homeCardInbox
          * @member {Object} inboxDetails
          */
          inboxDetails: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;
            $rootScope.unreadMessages = $scope.inboxDetails.unreadMessages;
            $rootScope.getEmailFromCpcFailed = $scope.inboxDetails.getEmailFailed || '';

            $scope.getMessageDisplayDate = messageService.getMessageDisplayDate;
            $scope.readMessage = function(message) {
              $scope.gotoView('/inbox/messages/' + message.messageId); 
              if (message.unread) {
                $rootScope.unreadMessages--;
                $rootScope.refreshNavbar();
              }
            };
          }
        ]
      };
    }
  ]);
}());
