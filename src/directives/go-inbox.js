/**
 * Directive for an element to go back to inbox.
 *
 * @namespace Directives
 * @class goInbox
 */
angular.module('blueconnect.mobile.directives.goInbox', [])
.directive('goInbox', ['$rootScope', '$location', function($rootScope, $location) {
  return {
    restrict: 'AE',
    link: function(scope, elem, attrs) {
      elem.on('click', function() {
          scope.$apply(function() {
             if($rootScope.returnToInbox !== undefined){
                $location.url($rootScope.returnToInbox);
              }
              else{
                $location.url('/home');
              }
          });
      });
    }
  };
}]);
