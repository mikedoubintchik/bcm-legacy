/**
 * Directive for the message compose screen.
 *
 * @namespace Directives
 * @class inboxCompose
 */
(function() {
  'use strict';
    angular.module('blueconnect.mobile.directives.inboxCompose', [])
    .directive('inboxCompose', [
      'messageService',
      function(messageService) {
        return {
          restrict: 'AE',
          replace: true,
          templateUrl: 'partials/inbox-compose.html',
          scope: {
            /**
            * Message data preloaded if composing a reply.
            *
            * @memberof inboxCompose
            * @member {Object} message
            */
            message: '='
          },
          controller: [
            '$scope',
            '$rootScope',
            '$location',
            '$window',
            '$timeout',
            'inquiryService',
            'quickAlertService',
            'alertService',
            'adobeService',
            'analyticConstants',
            function($scope, $rootScope, $location, $window, $timeout, inquiryService, quickAlertService, alertService, adobeService, analyticConstants) {
              $scope.loc = $rootScope.loc;
              $scope.gotoView = $rootScope.gotoView;

              /**
              * The available inquiry types.
              *
              * @memberof inboxCompose
              * @member {Array} inquiryTypes
              */
              $scope.inquiryTypes = inquiryService.getInquiryTypes($scope.message.state);

              /**
              * Whether the message is a reply to another message.
              *
              * @memberof inboxCompose
              * @member {Boolean} isReply
              */
              $scope.isReply = typeof $scope.message.caseId !== 'undefined';



              /**
              * ($rootScope) Validates the message form. Called by the basic navbar.
              *
              * @memberof inboxCompose
              * @method onSendValidation
              */
              $rootScope.onSendValidation = function() {
                if (!$scope.messageForm.$valid) {
                  $scope.validateMessageForm();
                } else {
                  $scope.sendMessage();
                }
                $scope.$watch('message', function() {
                  $timeout(function() {
                    $scope.validateMessageForm();
                  }, 200);
                }, true);
              };

              $scope.validateMessageForm = function() {
                /**
                * SHOW/HIDE the "REQUIRED" validation
                */
                angular.element('.ng-valid').parent().children('.gray-bar-label').children('.right-action').css('display', 'none');
                angular.element('.ng-invalid').parent().children('.gray-bar-label').children('.right-action').css('display', 'inline-table');

                angular.element('.ng-valid').parent().parent().children('.gray-bar-label').children('.right-action').css('display', 'none');
                angular.element('.ng-invalid').parent().parent().children('.gray-bar-label').children('.right-action').css('display', 'inline-table');
              };

              /**
              * Delete Message alertService called by the bacisnavbarleftclick
              *
              *@memberof inboxCompose
              *@method deleteMessage
              **/
              $rootScope.deleteMessage = function() {
                alertService.showAlert($rootScope.loc.DELETE_MESSAGE, $rootScope.loc.DELETE_MESSAGE_WARNING, {
                  title: $rootScope.loc.DELETE,
                  color: 'red'
                }, {
                  title: $rootScope.loc.CANCEL
                }).then(function() {
                  adobeService.trackAction("inbox:newMessage:delete", analyticConstants.INBOX_SECTION);
                  $window.history.back();
                }, function() {
                  adobeService.trackAction("inbox:newMessage:cancel", analyticConstants.INBOX_SECTION);
                });
              };

              /**
              * Sends the message with the message service.
              *
              * @memberof inboxCompose
              * @method sendMessage
              */
              $scope.sendMessage = function() {
                adobeService.trackAction("inbox:sendConfirmation", analyticConstants.INBOX_SECTION);
                alertService.showAlert($rootScope.loc.SEND_MESSAGE, $rootScope.loc.SEND_MESSAGE_WARNING, {
                  title: $rootScope.loc.SEND,
                  color: 'green'
                }, {
                  title: $rootScope.loc.CONTINUE_EDITING
                }).then(function() {
                  $rootScope.messageSending = true;
                  $rootScope.$emit('pageLoading');

                  messageService.composeMessage(angular.copy($scope.message)).then(function() {
                    $rootScope.messageSending = false;
                    if ($location.search().option === 'claims') {
                      $location.url('/claims/'+ $location.search().claim +'/' + $location.search().dependentNo + '?messageSent=true');
                    } else {
                      adobeService.trackAction("inbox:sendConfirmation:send", analyticConstants.INBOX_SECTION);
                      $location.url($location.search().returnTo + '?messageSent=true');
                    }

                  }, function() {
                    $rootScope.$emit('pageLoaded');
                    $rootScope.messageSending = false;

                    quickAlertService.showQuickAlert({
                      message: $rootScope.loc.SEND_ERROR,
                      color: 'red',
                      alertBottom: true
                    });
                    $timeout(function() {
                      angular.element('.quick-alert-modal').hide();
                    }, 2000);
                  });
                }, function(){
                  adobeService.trackAction("inbox:sendConfirmation:continueEditing", analyticConstants.INBOX_SECTION);
                });
              };

              /**
              * Auto-sizes the mesagge body input to fill the remainder of the screen.
              *
              * @memberof inboxCompose
              * @method sizeMessageInput
              */
              $scope.sizeMessageInput = function() {
                var input = angular.element('.message-input textarea ');
                if (!input.position()) {
                  $timeout($scope.sizeMessageInput, 100);
                  return;
                }
                input.height(angular.element(document).height() - angular.element('.message-box').position().top - input.position().top - 12);
              };
              $scope.sizeMessageInput();
              /**
              * Focus at the starting of the message body.
              *
              * @method focusMessageBody
              */
              $scope.focusMessageBody = function(){
                $timeout(function () {
                  var input = angular.element('#message');
                  input[0].focus();
                  input[0].setSelectionRange(0,0);
                }, 100);
              };

              $scope.focusMessageBody();

              /**
              * Switches focus after selecting an inquiry type
              *
              * @memberof inboxCompose
              * @method switchFocus
              */
              $scope.switchFocus = function() {
                document.getElementById('subject').focus();
              };

              /**
               *
               */
              $scope.setComposeClaim = function( claim ) {
                $('#inquiryType').val('string:CLAIMS');
                $('#subject').val($rootScope.loc.COMPOSE_SUBJECT_CLAIMS);
                $('#message').val($rootScope.loc.COMPOSE_CLAIM_NUMBER_CLAIMS + ' ' + claim );
                $('#inquiryType').trigger('input').trigger('change').trigger('keydown');
                $('#subject').trigger('input').trigger('change').trigger('keydown');
                $('#message').trigger('input').trigger('change').trigger('keydown');
              };

              if ( $scope.message.option == 'claims') {
                $timeout(function () {
                  $scope.setComposeClaim( $scope.message.claim );
                });
              }

              $scope.switchFocus();
              adobeService.trackState('inbox:compose', analyticConstants.INBOX_SECTION);
            }
          ]
        };
      }
    ]);
  }());
