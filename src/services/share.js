/**
 * Service for showing a share modal.
 *
 * @namespace Services
 * @class shareService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.share', [])
  .service('shareService', [
    '$q',
    '$rootScope',
    '$window',
    'cordovaService',
    'adobeService',
    function($q, $rootScope, $window, cordovaService, adobeService) {
      /**
      * Sharing content types (TEXT|URL|FILES).
      *
      * @memberof shareService
      * @member {Object} contentType
      */
      this.contentType = {
        TEXT: 'TEXT',
        URL: 'URL',
        FILES: 'FILES'
      };

      /**
       * Activates native sharing modal.
       *
       * @memberof shareService
       * @method showSharing
       * @param  {String}       type    The type of content to share (TEXT|URL|FILES).
       * @param  {String|Array} content The content to share.
       * @return {Promise} A promise that resolves or rejects, based on whether the share was performed or cancelled.
       */
      this.showSharing = function(type, content) {
        var deferred = $q.defer();

        if(typeof cordova === 'undefined') {
          deferred.resolve();
          return deferred.promise;
        }

        var options = {};

        switch(type) {
          case 'URL':
            options.url = content;
            break;
          case 'FILES':
            if(typeof content === 'string') {
              options.files = [content];
              break;
            }
            options.files = content;
            break;
          default:
            options.message = content;
            break;
        }

        $rootScope.pausedForShare = true;
        $window.plugins.socialsharing.shareWithOptions(options, function(result) {
          deferred.resolve(result);
        }, function(err) {
          deferred.reject(err);
        });


        return deferred.promise;
      };
    }
  ]);
}());
