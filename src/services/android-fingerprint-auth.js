/**
 * Service for communication with Androids's Fingerprint SDK.
 *
 * @namespace Services
 * @class androidFingerprintAuthService
 */
(function() {
	'use strict';

	angular.module('blueconnect.mobile.services.androidFingerprintAuth', [])
		.service('androidFingerprintAuthService', [
			'$rootScope',
			function($rootScope) {
				var parent = this;

				this.isAvailableSuccess = function (result) {
					// alert("FingerprintAuth available: " + JSON.stringify(result));
					if (result.isAvailable) {
						var encryptConfig = {
							clientId: "myAppName",
							username: "currentUser",
							password: "currentUserPassword",
	            disableBackup: true
						}; // See config object for required parameters
						FingerprintAuth.encrypt(encryptConfig, parent.successCallback, parent.errorCallback);
					}
				};

				this.isAvailableError = function (message) {
					// alert("isAvailableError(): " + message);
				};

				this.successCallback = function(result) {
					$rootScope.fingerprintOK();
				};

				this.errorCallback = function (error) {
					$rootScope.fingerprintNotOK();
				};

				var onPause = function () {
					// CRIT [ TODO: This application has been suspended. Save application state here.]
				};

				var onResume = function () {
					// CRIT [ TODO: This application has been reactivated. Restore application state here.]
				};

				if (typeof cordova !== 'undefined') {
					document.addEventListener('deviceready', function() {

						document.addEventListener( 'pause', onPause.bind( this ), false );
						document.addEventListener( 'resume', onResume.bind( this ), false );

					});
				}
			}
		]);
}());
