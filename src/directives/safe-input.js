/**
 * Directive for the removal of URL unsafe characters from an input.
 *
 * @namespace Directives
 * @class safeInput
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.safeInput', [])
  .directive('safeInput', function(){
  	return {
      restrict: 'A',
  		require: 'ngModel',
  		link: function(scope, element, attrs, modelCtrl) {
  			modelCtrl.$parsers.push(function (inputValue) {
  				if(inputValue){
  					if(!inputValue.length) {
  						return inputValue;
  					}

  					var transformedInput = inputValue.replace(/[^a-zA-Z0-9_-\s]/g, '');
  					if (transformedInput!=inputValue) {
  						modelCtrl.$setViewValue(transformedInput);
  						modelCtrl.$render();
  					}

  					return transformedInput;
  				}
  				return inputValue;
  			});
  		}
  	};
  });

}());
