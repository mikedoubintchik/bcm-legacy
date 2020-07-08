/**
 * Directive for the check box element.
 *
 * @namespace Directives
 * @class checkBox
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.checkBoxGroup', [])
  .directive('checkBoxGroup', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/check-box-group.html',
        scope: {
          /**
          *
          * @memberof checkBox
          * @member {Object} model Collection of items to iterate over to generate checkbox items
          * @member {Object} selection The array containing those selected checkboxs
          * @member {Method} action This is a method defined in the controlling object to perform tasks
          */
          model     : '=',
          selection : '=',
          action    : '&'
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
          }
        ]
      };
    }
  ]);
}());
