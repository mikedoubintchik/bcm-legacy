/**
 * Directive for a single inbox message.
 *
 * @namespace Directives
 * @class inboxMessage
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.inboxMessage', [])
  .directive('inboxMessage', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/inbox-message.html',
        scope: {
          /**
          * Display information for the inbox message.
          *
          * @memberof inboxMessage
          * @member {Object} message
          */
          message: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$timeout',
          'messageService',
          'quickAlertService',
          'adobeService',
          function($scope, $rootScope, $location, $timeout, messageService, quickAlertService, adobeService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.getMessageBodyHtml = messageService.getMessageBodyHtml;
            $scope.getMessageDisplayDate = messageService.getMessageDisplayDate;

            /**
             * Toggles the quick-alert-modal for sent message if messageSent is true
             *
             * @memberof inboxMessage
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
          }
        ]
      };
    }
  ]);
}());
