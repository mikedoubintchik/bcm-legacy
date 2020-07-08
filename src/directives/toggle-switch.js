/**
 * Directive for the toggle switch element.
 *
 * @namespace Directives
 * @class toggleSwitch
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.toggleSwitch', [])
  .directive('toggleSwitch', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/toggle-switch.html',
        scope: {
          /**
          * Boolean to tie to the toggle.
          *
          * @memberof tabSelect
          * @member {Boolean} model
          */
          model: '=',
          /**
          * Function to callback with the model value.
          *
          * @member {Function} onClick
          */
          onClick: '=',
          controlled: '=?'
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope) {
            /**
             * Toggles the model between true and false.
             *
             * @memberof tabSelect
             * @method toggleModel
             */
            $scope.toggleModel = function() {
              if (!$scope.controlled) {
                $scope.model = !$scope.model;
              }

              // Event.
              if ($scope.onClick) {
                $scope.onClick($scope.model);
              };
            };

            /**
             * Toggles the model on.
             *
             * @memberof tabSelect
             * @method modelOn
             */
            $scope.modelOn = function() {
              if (!$scope.model) {
                $scope.toggleModel();
              }
            };

            /**
             * Toggles the model off.
             *
             * @memberof tabSelect
             * @method modelOff
             */
            $scope.modelOff = function() {
              if ($scope.model) {
                $scope.toggleModel();
              }
            };
          }
        ]
      };
    }
  ]);
}());
