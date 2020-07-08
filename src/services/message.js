/**
 * Services for the parsing and formatting of messages.
 *
 * @namespace Services
 * @class messageService
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.services.message', [])
  .service('messageService', [
    '$q',
    '$http',
    '$sce',
    '$filter',
    'config',
    'inquiryService',
    function($q, $http, $sce, $filter, config, inquiryService) {
      var apiUrl = config.apiUrl || 'https://api.bcbsnc.com';
      var capraApiUrl = config.capraApiUrl || 'https://capra.bcbsnc.com';

      /**
      * Returns a 125 character, HTML trusted snippet of the message body.
      *
      * @memberof messageService
      * @method getMessageBodySnippet
      * @param  {Object} message The message to get the snippet from.
      * @return {Object} The trusted HTML.
      */
      this.getMessageBodySnippet = function(message) {
        if(message.body.length > 125) {
          return $sce.trustAsHtml(message.body.substr(0, 125) + '...');
        }

        return $sce.trustAsHtml(message.body);
      };

      /**
      * Returns a 15 character, HTML trusted snippet of the message subject.
      *
      * @memberof messageService
      * @method getMessageSubjectSnippet
      * @param  {Object} message The message to get the snippet from.
      * @return {Object} The trusted HTML.
      */
      this.getMessageSubjectSnippet = function(message) {
        if(message.subject.length > 15) {
          return $sce.trustAsHtml(message.subject.substr(0, 15) + '...');
        }

        return $sce.trustAsHtml(message.subject);
      };

      /**
      * Returns a message body as trusted HTML.
      *
      * @memberof messageService
      * @method getMessageBodyHTML
      * @param  {Object} message The message to get content from.
      * @return {Object} The trusted HTML.
      */
      this.getMessageBodyHtml = function(message) {
        return $sce.trustAsHtml(message.body);
      };

      /**
      * Returns a message display date, filtered based on how old the message is.
      *
      * @memberof messageService
      * @method getMessageDisplayDate
      * @param  {Object}  message The message to get the date from.
      * @param  {Boolean} [full]  Whether to override filtering and return a full date.
      * @return {String} The display date.
      */
      this.getMessageDisplayDate = function(message, full) {
        var now = new Date();
        var nowTime = now.getTime();
        var date = moment(message.createdDate).toDate();
        var dateTime = date.getTime();

        var oneDay = 1000 * 60 * 60 * 24;

        if(full) {
          return $filter('date')(date, 'M/d/yy h:mm a');
        }
        else if(now.getFullYear() !== date.getFullYear()) {
          return $filter('date')(date, 'M/d/yy');
        }
        else if(nowTime - dateTime < oneDay && now.getDate() === date.getDate()) {
          return $filter('date')(date, 'h:mm a');
        }

        return $filter('date')(date, 'MMM d');
      };

      /**
      * Retrieves the total and unread message counts.
      *
      * @memberof messageService
      * @method getMessageCounts
      * @return {Promise} A promise that resolves to function(counts).
      */
      this.getCounts = function() {
        var deferred = $q.defer();

        $http.get(apiUrl + '/messages/count').success(function(result) {
          deferred.resolve(result);
        }).error(function(error, status) {
          deferred.reject(error, status);
        });

        return deferred.promise;
      };

      /**
      * Creates a new message.
      *
      * @memberof messageService
      * @method composeMessage
      * @param  {Object} message The message content.
      * @return {Promise} A promise that resolves to function(result).
      */
      this.composeMessage = function(message) {
        var deferred = $q.defer();

        message.inquiryType = inquiryService.getSalesforceInquiryType(message.inquiryType);

        $http.post(apiUrl + '/messages', message).success(function(result) {
          deferred.resolve(result);
        }).error(function(error, status) {
          deferred.reject(error, status);
        });

        return deferred.promise;
      };

      /**
      * Creates a new email, the email would be sent via capra's email service.
      *
      * @memberof messageService
      * @method sendEmail
      * @param  {Object} message The message content with subject and text
      * @return {Promise} A promise that resolves to function(result).
      */
      this.composeEmail = function(message) {
        var deferred = $q.defer();

        $http.post(capraApiUrl + '/email', message).success(function(result) {
          deferred.resolve(result);
        }).error(function(error, status) {
          deferred.reject(error, status);
        });

        return deferred.promise;
      };

      /**
      * Deletes a message.
      *
      * @memberof messageService
      * @method deleteMessage
      * @param  {String} messageId The unique ID of the message.
      * @return {Promise} A promise that resolves to function(result).
      */
      this.deleteMessage = function(messageId) {
        var deferred = $q.defer();

        $http.put(apiUrl + '/messages', {
          operation: 'DELETE',
          messageIds: messageId
        }).success(function(result) {
          deferred.resolve(result);
        }).error(function(error, status) {
          deferred.reject(error, status);
        });

        return deferred.promise;
      };

      /**
      * Updates a message.
      *
      * @memberof messageService
      * @method updateMessage
      * @param  {String} messageId The unique ID of the message.
      * @param  {String} operation The update to perform (READ, UNREAD, OPENED).
      * @return {Promise} A promise that resolves to function(result).
      */
      this.updateMessage = function(messageId, operation) {
        var deferred = $q.defer();

        $http.put(apiUrl + '/messages', {
          operation: operation.toUpperCase(),
          messageIds: messageId
        }).success(function(result) {
          deferred.resolve(result);
        }).error(function(error, status) {
          deferred.reject(error, status);
        });

        return deferred.promise;
      };

      /**
      * Bookmarks or unbookmarks a message.
      *
      * @memberof messageService
      * @method bookmarkMessage
      * @param  {String}  messageId  The unique ID of the message.
      * @param  {Boolean} bookmarkOn Whether to bookmark or unbookmark.
      * @return {Promise} A promise that resolves to function(result).
      */
      this.bookmarkMessage = function(messageId, bookmarkOn) {
        var deferred = $q.defer();

        if(bookmarkOn) {
          $http.post(apiUrl + '/bookmarks', {
            type: 'MESSAGE',
            id: messageId
          }).success(function(result) {
            deferred.resolve(result);
          }).error(function(error, status) {
            deferred.reject(error, status);
          });
        }
        else {
          $http.delete(apiUrl + '/bookmarks/MESSAGE/' + messageId).success(function(result) {
            deferred.resolve(result);
          }).error(function(error, status) {
            deferred.reject(error, status);
          });
        }

        return deferred.promise;
      };
    }
  ]);
}());
