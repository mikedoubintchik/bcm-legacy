(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowCtaButton', [])
    /**
     * A layout directive to create a row for a cta button to be formatted well on mobile
     */
    .directive('ctaButtonRow', function() {
        return {
          restrict: 'E',
        };
      })
      /**
      * If an action funciton is passed from the parent controller it will override
      * the page transition functionality. Applied classes change the styling.
      * Available classes [ white, condensed-font, blue ]
      * @example
      * <cta-button-row>
      *   <cta-button class="white condensed-font">{{loc.buttonText}}</cta-buttonp>
      * </cta-button-row>
      *  @example
      * <cta-button-row>
      *   <cta-button class="blue">{{loc.buttonText}}</cta-buttonp>
      * </cta-button-row>
      */
      .directive('ctaButton', function() {
        return {
          restrict: 'E',
          transclude: true,
          templateUrl: 'partials/payment-flow-cta-button.html',
          scope: {
            /**
             * @param
             */
            transitionPage: '@?',
            /**
             * @param
             */
            actionFn: '=?',
            loading: '=?',
            loadingText: '=?'
          },
          controller: ['$rootScope', '$scope', function($rootScope, $scope) {
            $scope.gotoView = $rootScope.gotoView;
            $scope.loading = angular.isUndefined($scope.loading) ? false : $scope.loading;
            $scope.loadingText = angular.isUndefined($scope.loadingText) ? $rootScope.loc.BP_LOADING : $scope.loadingText;
          }],
          link: function(scope, elem, attr, ctrl) {
            elem.on('click', function() {
              scope.gotoView(scope.transitionPage);
            });
          }
        };
    });
})();