/**
 * Directive for the compose message box on the claim details page.
 *
 * @namespace Directives
 * @class claimCompose
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimCompose', [])
  .directive('claimCompose', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claim-compose.html',
        scope: {
          /**
          * The claim information to display.
          *
          * @memberof claimCompose
          * @member {Object} secureMessage
          */
          secureMessage: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          'adobeService',
          '$location',
          'quickAlertService',
          '$timeout',
          function($scope, $rootScope, adobeService, $location, quickAlertService, $timeout) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;


            if($location.search().messageSent) {
              $rootScope.cliamSendMessage = true;
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
