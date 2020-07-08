/**
 * Directive for the radio button element.
 *
 * @namespace Directives
 * @class radioButton
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.radioButton', [])
  .directive('radioButton', [
    function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/radio-button.html',
        scope: {
          /**
          * The radio buttons defined for usage. Each button consists of a name, label, value, and status.
          *
          * @memberof radioButton
          * @member {Array} buttons
          */
          buttons:'=',

          /**
          * This is the single value representing the radio button group.
          *
          * @memberof radioButton
          * @member {String} buttons
          */
          value:'='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {

            /**
            * This method toggles on non-selected buttons off and turns on the selected button.
            *
            * @memberof radioButton
            * @member {Object} selectedButton  The currently seleted button.
            * @member {Array} buttonCollection The collection of buttons within this group.
            */
            $scope.toggleRadio = function(selectedButton, buttonCollection) {
              disableButtons(buttonCollection);

              selectedButton.status = true;
              $scope.value          = selectedButton.value;
            };

            var disableButtons = function(buttonCollection) {
              for (var index = 0; index < buttonCollection.length; index++) {
                buttonCollection[index].status = false;
              }
            };

            var init = function(buttons) {
              for (var index = 0; index < buttons.length; index++) {
                if (buttons[index].status === true) {
                  $scope.value = buttons[index].value;
                  break;
                }
              }
            };

            init($scope.buttons);
          }
        ]
      };
    }
  ]);
}());
