(function() {
  angular
    .module('blueconnect.mobile.directives.paymentFlowReusableDirectives', [])
    /**
     * @description
     * A reusable dividing line for spacing, designed for use in the payment flow
     */
    .directive('pfDivider', function() {
      return {
        template: '<div class="dividing-line"></div>'
      };
    })
    /**
     * @description
     * A directive used to open a pfModal. Set the attribute equal to the string name
     * of the modal directive that you want to open.
     */
    .directive('pfModalOpen', ['$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        scope: true,
        link: function(scope, elem, attr) {
          elem.on('click', function() {
            $rootScope.$broadcast('openPaymentFlowModal:' + attr.pfModalOpen)
          });
        }
      };
    }])
    /**
     * @description
     * A modal used in the payment flow section of the site
     * @param {string} name The unique name for the modal which is also used with pfModalOpen
     * @param {string} title The title displayed in on the modals top bar
     * @param {function} agreementButton The passed in function to be run on the parent scope when 
     * the user accepts the information displayed in the modal. No value will hide the acceptance 
     * button.
     * @example 
     * <pf-modal 
     *  name="uniqueNameToBeUsedByPfModalOpen" 
     *  title="titleBarContent"
     *  button="textDisplayedOnTheAgreementButton"
     *  agreementButton="someFunctionFromTheParentController">
     *    <p>Place html content in p tag for text styling</p>
     * <pf-modal>
     */
    .directive('pfModal', ['$rootScope', function($rootScope) {
      return {
        restrict: 'E',
        scope: {
          name: '@',
          title: '@modalTitle',
          button: '@modalButton',
          agreementButton: '&?'
        },
        controller: ['$scope', function($scope) {
          var vm = this;
          $scope.open = false;
          $scope.closeModal = function() {
            angular.element('#pf-scrollable-section').addClass('payment-flow-phone-scroll');
            
            $scope.open = false;
          };
          
          $scope.acceptModal = function() {
            angular.element('#pf-scrollable-section').addClass('payment-flow-phone-scroll');
            $scope.agreementButton();
            $scope.open = false;
          };

        }],
        transclude: true,
        controllerAs: 'modalCtrl',
        templateUrl: 'partials/payment-flow-modal.html',
        link: function postLink(scope, elem, attr, modalOpenCtrl) {
          scope.$on('openPaymentFlowModal:' + scope.name, function() {
            scope.open = true;
            angular.element('#pf-scrollable-section').removeClass('payment-flow-phone-scroll');
            scope.$apply();
          });
        }
      };
    }])
    /**
     * A reusable error message to be used in the payment flow page
     * @description
     * @example
      <pr-error-message ng-show="forIsValid">{{loc.BP}}</pf-error-message>
     */
    .directive('pfErrorMessage', function() {
      return {
        restrict: 'E',
        transclude: true,
        template: '<p ng-transclude></p>'
      }
    });
})();