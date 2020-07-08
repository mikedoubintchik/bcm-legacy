/**
 * Directive for the details box on the id card details page.
 *
 * @namespace Directives
 * @class feedback
 */
(function() {
	'use strict';

	angular.module('blueconnect.mobile.directives.feedback', [])
		.directive('feedback', [
			'messageService',
			'$rootScope',
			function(messageService, $rootScope) {
				return {
					restrict: 'AE',
					replace: true,
					templateUrl: 'partials/feedback.html',
					scope: {
						/**
						 *
						 * @memberof feedback
						 * @member {Object} details
						 */
						data: '='
					},
					controller: [
						'$scope',
						'$rootScope',
						'$timeout',
						'adobeService',
						'quickAlertService',
						function($scope, $rootScope, $timeout, adobeService, quickAlertService) {
							$scope.loc = $rootScope.loc;
							$scope.gotoView = $rootScope.gotoView;
							$scope.device = $rootScope.device;

							$scope.setExperience = function( value ) {
								$scope.data.experience = value;
							};

							var setFeedback = function() {
								for(var i=0; i<$scope.data.questions.length; i++){
									var question = $('[data-question="'+i+'"]');
									var topic = question.find('select option:selected').text();
									var topicValue = question.find('select').val();
									var comment = question.find('textarea').val();
									$scope.data.questions[i].chosenTopic = topic;
									$scope.data.questions[i].chosenTopicValue = topicValue;
									$scope.data.questions[i].chosenComment = comment;
								}
							};

							var setEmailBody = function() {
								var body = 'Experience = ' + $scope.data.experience;
								for(var i=0; i<$scope.data.questions.length; i++){
									body += ', Topic: ' + $scope.data.questions[i].chosenTopic;
									body += ', Topic Value: ' + $scope.data.questions[i].chosenTopicValue;
									body += ', Comment: ' + $scope.data.questions[i].chosenComment;
								}
								$scope.data.body = body;
							};

							var showThankYou = function() {
								$('.feedback-form').hide();
								$('.feedback-thankyou').show();
							};

							$scope.submitFeedback = function(isValid) {
								setFeedback();

								if( isValid ){
									setEmailBody();

									var email ={};
									//email.to = $scope.data.email;
									email.from = $scope.data.yourEmailAddress;
									email.subject = $scope.data.subject;
									email.text = $scope.data.body;

									//hand off the email to message service for delivery
									messageService.composeEmail(angular.copy(email)).then(function(result) {
										$rootScope.messageSending = false;
									}, function(error, status) {
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
									//show thank you page after email sent to service
									showThankYou();
								}
							};

							$scope.formDone = function() {
								setTimeout(function(){
									$('#navbar-left-click').trigger('click');
								}, 300);
							};
						}
					]
				};
			}
		]);
}());
