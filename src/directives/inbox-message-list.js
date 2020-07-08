/**
 * Directive for the inbox message list element.
 *
 * @namespace Directives
 * @class inboxMessageList
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.inboxMessageList', [])
  .directive('inboxMessageList', [
    '$rootScope',
    '$timeout',
    'alertService',
    'messageService',
    'quickAlertService',
    function($rootScope, $timeout, alertService, messageService, quickAlertService) {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/inbox-message-list.html',
        scope: {
          /**
          * Display information for the inbox message list.
          *
          * @memberof inboxMessageList
          * @member {Object} messages
          */
          messages: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$route',
          'messageService',
          'adobeService',
          function($scope, $rootScope, $location, $route, messageService, adobeService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            $scope.getMessageSubjectSnippet = messageService.getMessageSubjectSnippet;
            $scope.getMessageBodySnippet = messageService.getMessageBodySnippet;
            $scope.getMessageDisplayDate = messageService.getMessageDisplayDate;

            /**
             * If user wants to return from the message view, but they just replied or composed a messages, we want to replace BACK with this returnToInbox
             *
             * @memberof inboxMessageList
             */
            $rootScope.returnToInbox = $location.url();

            /**
            * Reloads the current page
            *
            * @memberof inboxMessageList
            * @method reloadPage
            */
            $scope.reloadPage = function(){
              $route.reload();
              // angular.element('#app-container').removeClass('no-scroll');
            };

            /**
            * If user doesn't have the messages based on the $location.path it will display the messages.
            */
            if($scope.messages.length === 0){
              if($location.path() ==='/inbox'){
                $scope.noMessages = $rootScope.loc.NO_INBOX_MESSAGES;
              } else if($location.path() ==='/inbox/sent') {
                $scope.noMessages = $rootScope.loc.NO_SENT_MESSAGES;
              } else if($location.path() ==='/inbox/bookmarked') {
                $scope.noMessages = $rootScope.loc.NO_MESSAGES_BOOKMARKED;
              } else if($location.path() ==='/inbox/search' && $location.search().q) {
                $scope.noMessages = $rootScope.loc.SECURE_INBOX_NO_SEARCH_RESULTS;
              } else if($location.path() ==='/inbox/search' && !$location.search().q) {
                $scope.noMessages = $rootScope.loc.SECURE_INBOX_NO_SEARCH;
              }
           }


            /**
             * Toggles the quick-alert-modal for sent message if messageSent is true
             *
             * @memberof inboxMessageList
             */
            if($location.search().messageSent) {
              $rootScope.sentMessage = true;
              quickAlertService.showQuickAlert({message: $rootScope.loc.MESSAGE_SENT, color: 'green'});
              $timeout(function() {
                  angular.element('.quick-alert-modal').hide();
              }, 2000);
              var search = angular.copy($location.search());
              delete search.messageSent;
              $location.search(search);
            }

            /**
             * Opens the individual message view if no message is swiped.
             *
             * @memberof inboxMessageList
             * @method openMessage
             * @param  {Object} message The message to open.
             */
            $scope.openMessage = function(message) {
              for(var i = 0; i < $scope.messages.length; i++) {
                if($scope.messages[i].swiped) {
                  $scope.messages[i].swiped = false;
                  return;
                }
              }
              if (message.unread) {
                $rootScope.unreadMessages--;
                $rootScope.refreshNavbar();
              }

              $rootScope.gotoView('/inbox/messages/' + message.messageId);
            };

            /**
             * Opens the message options when swiped left.
             *
             * @memberof inboxMessageList
             * @method swipeMessage
             * @param  {Object} message The message swiped.
             */
            $scope.swipeMessage = function(message) {
              for(var i = 0; i < $scope.messages.length; i++) {
                if($scope.messages[i].swiped) {
                  $scope.messages[i].swiped = false;
                }
              }
              message.swiped = true;
            };

            /**
             * Closes the message options when swiped right.
             *
             * @memberof inboxMessageList
             * @method unswipeMessage
             * @param  {Object} message The message swiped.
             */
            $scope.unswipeMessage = function(message) {
              if(message.swiped) {
                message.swiped = false;
              }
            };

            /**
             * Toggles whether the message is read with the message service.
             *
             * @memberof inboxMessageList
             * @method toggleRead
             * @param  {Object} message The message to toggle.
             */
            $scope.toggleRead = function(message) {
              $rootScope.$emit('pageLoading');
              $rootScope.unreadMessages = message.unread ? $rootScope.unreadMessages - 1 : $rootScope.unreadMessages + 1;

              messageService.updateMessage(message.messageId, message.unread ? 'READ' : 'UNREAD').then(function() {
                message.unread = !message.unread;
                $scope.unswipeMessage(message);
                $rootScope.$emit('pageLoaded');
                $rootScope.refreshNavbar();
              }, function(error, status) {
                $rootScope.$emit('pageLoaded');
              });
            };

            /**
             * Toggles whether the message is bookmarked with the message service.
             *
             * @memberof inboxMessageList
             * @method toggleBookmarked
             * @param  {Object} message The message to toggle.
             */
            $scope.toggleBookmarked = function(message) {
              $rootScope.$emit('pageLoading');

              messageService.bookmarkMessage(message.messageId, !message.bookmarked).then(function() {
                if($location.url().indexOf('/bookmarked') > -1) {
                  for(var i = 0; i < $scope.messages.length; i++) {
                    if(message.messageId === $scope.messages[i].messageId) {
                      $scope.messages.splice(i, 1);
                      $scope.reloadPage();
                      break;
                    }
                  }
                }
                else {
                  message.bookmarked = !message.bookmarked;
                  $scope.unswipeMessage(message);
                }

                $rootScope.$emit('pageLoaded');
              }, function(error, status) {
                $rootScope.$emit('pageLoaded');
              });
            };

            /**
             * Confirms deletion of a message and performs the action with the message service.
             *
             * @memberof inboxMessageList
             * @method confirmDeletion
             * @param  {Object} message The message to delete.
             */
            $scope.confirmDeletion = function(message) {
              alertService.showAlert($rootScope.loc.DELETE_MESSAGE, $rootScope.loc.DELETE_MESSAGE_WARNING, {title: $rootScope.loc.DELETE, color: 'red'}, {title: $rootScope.loc.CANCEL}).then(function() {
                $rootScope.$emit('pageLoading');
                angular.element('.inbox-message-list').addClass('no-scroll');
                messageService.deleteMessage(message.messageId).then(function() {
                  for(var i = 0; i < $scope.messages.length; i++) {
                    if(message.messageId === $scope.messages[i].messageId) {
                      $scope.messages.splice(i, 1);
                      $scope.reloadPage();
                      break;
                    }
                  }
                  $rootScope.$emit('pageLoaded');
                }, function(error, status) {
                  $rootScope.$emit('pageLoaded');
                });
              });
            };

          }
        ]
      };
    }
  ]);
}());
