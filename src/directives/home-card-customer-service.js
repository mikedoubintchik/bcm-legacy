/**
 * Directive for the  Customer service card on the home screen.
 *
 * @namespace Directives
 * @class homeCardCustomerService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.homeCardCustomerService', [])
  .directive('homeCardCustomerService', [
    function(newsService) {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/home-card-customer-service.html',
        scope: {
          /**
          * Display information for the customer service
          *
          * @memberof homeCardCustomerService
          * @member {Object} customerDetails
          */
          customerDetails : "=",
          fadAlertModal : "="
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
            $scope.trackAction = $rootScope.trackAction;

            /**
             * Opens the default mail application
             */
            $scope.openMail = $rootScope.openMail;

            /**
            * Based on the row size it will display the items from customerDetails
            * Dividing the customerDetails object into rows
            *
            * @memberof homeCardCustomerService
            * @method getRowContent
            **/
            var rowSize = 2;

            $scope.customerDetails1 = getRowContent($scope.customerDetails, rowSize);
            function getRowContent(source, size) {
              var data = [];
              while (source.length > 0) {
                data.push(source.splice(0, size));
              }
              return data;
            }

            /**
            * Tracks a click on the card in analytics
            *
            * @memberof homeCardCustomerService
            * @method trackClick
            **/
            $scope.trackIconClick = function(item) {
              var state = '';
              switch(item.icon) {
                case 'help-compose':
                  state += 'homeComposeSecureMessageIcon';
                  break;
                case 'help-compose':
                  state += 'homeViewSecureInboxIcon';
                  break;
                case 'phone':
                  state += 'homeCallCustomerServiceIcon';
                  break;
                case 'faq':
                  state += 'homeFaqsIcon';
                  break;
                case 'circle-healthnav':
                  state += 'homeHealthNavIcon';
                  break;
                case 'feedback':
                  state += 'homeFeedbackIcon';
                  break;
                default:
                  state += 'homeUnknownIcon';
                  break;
              }
            };

            $scope.checkVitalsError = function(url) {
              if ($rootScope.vitalsError && url === '/fad-auth/find-doctor') {
                $scope.openAlertModal();
              } else {
                $scope.gotoView(url);
              }
            };

            $scope.alertModalObj = {
              title: $scope.fadAlertModal.title ? $scope.fadAlertModal.title : '',
              message: $scope.fadAlertModal.message ? $scope.fadAlertModal.message : '',
              confirmBtn: $scope.fadAlertModal.confirmBtn ? $scope.fadAlertModal.confirmBtn : '',
            };
          }
        ]
      };
    }
  ]);
}());
