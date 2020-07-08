/**
 * Directive for the member savings total on the claims page.
 *
 * @namespace Directives
 * @class memberSavingsFooter
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.memberSavingsFooter', [])
  .directive('memberSavingsFooter', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/member-savings-footer.html',
        scope: {
          /**
          * The member savings total.
          *
          * @memberof memberSavingsFooter
          * @member {Object} memberSavings
          */
          memberSavings: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            $scope.loc = $rootScope.loc;
            $scope.gotoView = $rootScope.gotoView;

            /**
             * Returns the member savings amount as currency.
             *
             * @memberof memberSavingsFooter
             * @method getSavingsDollarAmount
             * return {String} The member savings as currency.
             */
            $scope.getSavingsDollarAmount = function() {
              return '$' + $scope.memberSavings.toFixed(2);
            };
          }
        ]
      };
    }
  ]);
}());
