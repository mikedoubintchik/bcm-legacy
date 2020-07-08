/**
 * Directive for the individual message bottom bar.
 *
 * @namespace Directives
 * @class inboxMessageBottomBar
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.inboxMessageBottomBar', [])
  .directive('inboxMessageBottomBar', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/inbox-message-bottom-bar.html',
        scope: {
          /**
          * The message content.
          *
          * @memberof inboxMessageBottomBar
          * @member {String} message
          */
          message: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          '$window',
          '$location',
          '$timeout',
          '$filter',
          'alertService',
          'messageService',
          'quickAlertService',
          'shareService',
          'adobeService',
          'analyticConstants',
          function($scope, $rootScope, $window, $location, $timeout, $filter, alertService, messageService, quickAlertService, shareService, adobeService, analyticConstants) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.returnPath = $location.$$path;

            /**
             * Confirms the deletion of a message and then calls the message service to perform the deletion.
             *
             * @memberof inboxMessageBottomBar
             * @method confirmDeleteMessage
             */
            $scope.confirmDeleteMessage = function() {

              alertService.showAlert($rootScope.loc.DELETE_MESSAGE, $rootScope.loc.DELETE_MESSAGE_WARNING, {title: $rootScope.loc.DELETE, color: 'red'}, {title: $rootScope.loc.CANCEL}).then(function() {
                $rootScope.$emit('pageLoading');
                adobeService.trackAction("inbox:deleteConfirmation", analyticConstants.INBOX_SECTION);
                $scope.hideNav = true;
                messageService.deleteMessage($scope.message.messageId).then(function() {
                  adobeService.trackAction("inbox:deleteConfirmation:success", analyticConstants.INBOX_SECTION);
                  $window.history.back();
                }, function() {
                  $scope.delete = false;
                  $scope.hideNav = false;
                });
              }, function() {
                 adobeService.trackAction("inbox:deleteConfirmation:cancel", analyticConstants.INBOX_SECTION);
              });
            };

            /**
             * Based on the bookmarked flag, message is set to bookmarked(boolean)
             *
             * @memberof inboxMessageBottomBar
             * @method bookmarkMessage
             */
            $scope.bookmarkMessage = function() {

              messageService.bookmarkMessage($scope.message.messageId, !$scope.message.bookmarked).then(function() {
                if ($scope.message.bookmarked) {
                  quickAlertService.showQuickAlert({message: $rootScope.loc.MESSAGE_UNBOOKMARKED, color: 'blue'}, $scope.message.bookmarked);
                  $timeout(function() {
                      angular.element('.quick-alert-modal').hide();
                  }, 1200);
                } else {
                  quickAlertService.showQuickAlert({message: $rootScope.loc.MESSAGE_BOOKMARKED, color: 'blue'}, $scope.message.bookmarked);
                  $timeout(function() {
                      angular.element('.quick-alert-modal').hide();
                  }, 1200);
                }

                $scope.message.bookmarked = !$scope.message.bookmarked;

                $rootScope.$emit('bookMarkAlert');

              }, function() {
                console.log('bookmark failed');
              });
            };

            /**
             * Opens the sharing modal for the message.
             *
             * @memberof inboxMessageBottomBar
             * @method shareMessage
             */
            $scope.shareMessage = function() {
              var shareContent = "From: " + $scope.message.messageInitiatedBy + "\n" +
                                 "Sent: " + $filter('date')($scope.message.createdDate, 'short') + "\n" +
                                 "Subject: " + $scope.message.subject + "\n\n" + String($scope.message.body).replace(/<[^>]+>/gm, '');

              shareService.showSharing(shareService.contentType.TEXT, shareContent);
            };

            /**
             * Selects bookmark title wether boomkark or Unbookmark
             *
             * @memberof inboxMessageBottomBar
             * @method getBookmarkTitle
             */
            $scope.getBookmarkTitle = function() {
              return $scope.message.bookmarked ? $rootScope.loc.UNBOOKMARK : $rootScope.loc.BOOKMARK;
            };
          }
        ]
      };
    }
  ]);
}());
