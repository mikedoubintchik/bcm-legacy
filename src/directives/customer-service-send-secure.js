/**
 * Directive for the idCard Customer service tab on details page.
 *
 * @namespace Directives
 * @class idCardGroup
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.customerServiceSecureInbox', [])
  .directive('customerServiceSecureInbox', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/customer-service-secure-inbox.html',
        scope: {
          /**
          * The customer service tab to display.
          *
          * @memberof idCardCustomerService
          * @member {Object} contactDetails
          */
          customerServiceSecureInboxDetails: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$timeout',
          'quickAlertService',
          function($scope, $rootScope, $location, $timeout, quickAlertService) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;

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
