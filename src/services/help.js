/**
 * Service for showing a help modal.
 *
 * @namespace Services
 * @class helpService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.help', [])
    .service('helpService', [
      '$rootScope',
      function($rootScope) {
        /**
         * Shows a help modal. it should use the name attribute to pull the correct html
         *
         * @memberof helpService
         * @method showHelp
         * @param  {String}  fileName  The name of the html file to display in the help modal.
         */

        this.showHelp = function(fileName, data) {

          $rootScope.helpModal = {
            helpPath: fileName + '.html',
            data: data
          };

          angular.element('.header-container').css('z-index', 6);
          angular.element('.navbar').toggleClass('blur', true);
          $rootScope.blurContent = true;

          angular.element('.help-modal').modal('show');
          angular.element('.modal-backdrop').css('z-index', 1000);

          // start help body at top of scroll window each time it is opened
          angular.element('.help-modal').find('.modal-body').scrollTop(0);
        };

        this.help = function(info) {
          $rootScope.helpModal = {
            helpIn: info
          };
          angular.element('.header-container').css('z-index', 6);
          angular.element('.navbar').toggleClass('blur', true);
          $rootScope.blurContent = true;

          angular.element('.help-modal').modal('show');
          angular.element('.modal-backdrop').css('z-index', 1000);
          // start help body at top of scroll window each time it is opened
          angular.element('.help-modal').find('.modal-body').scrollTop(0);
        };

        this.terms = function(info) {
          $rootScope.termsModal = {
            termsIn: info
          };
          angular.element('.header-container').css('z-index', 6);
          angular.element('.navbar').toggleClass('blur', true);
          $rootScope.blurContent = true;

          angular.element('.terms-modal').modal('show');
          angular.element('.modal-backdrop').css('z-index', 1000);
          // start help body at top of scroll window each time it is opened
          angular.element('.terms-modal').find('.modal-body').scrollTop(0);
        };

        /**
         * Shows a image in full screen.
         *
         * @memberof helpService
         * @method imageFullScreen
         * @param  {String}  image  The image to display the fullScreen image.
         */

        this.imageFullScreen = function(image) {
          $rootScope.fullScreen = {
            imageIn: image
          };
          angular.element('.header-container').css('z-index', 6);
          angular.element('.navbar').toggleClass('blur', true);
          $rootScope.blurContent = true;
          angular.element('.full-screen-modal').modal('show');
          angular.element('.modal-backdrop').css('z-index', 1000);
        };
      }
    ]);
}());
