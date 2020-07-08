/**
 * Directive for the idCard Customer service tab on details page.
 *
 * @namespace Directives
 * @class idCardGroup
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.idCardCustomerService', [])
  .directive('idCardCustomerService', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/id-card-customer-service.html',
        scope: {
          /**
          * The customer service tab to display.
          *
          * @memberof idCardCustomerService
          * @member {Object} contactDetails
          */
          contactDetails: '=',
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          function($scope, $rootScope, $location) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;
          }
        ]
      };
    }
  ]);
}());
