/*
 * Controller for the id card view.
 *
 * @namespace Controllers
 * @class IdCardController
 */
(function() {
    'use strict';

    angular.module('blueconnect.mobile.controllers.idCard', [
            'bcbsnc.cloud.services.page'
        ])
        .controller('IdCardController', [
            '$scope',
            '$rootScope',
            'pageService',
            'adobeService',
            '$location',
            'analyticConstants',
            function($scope, $rootScope, pageService, adobeService, $location, analyticConstants) {
                $rootScope.showNav = true;
                $rootScope.showPolicySelect = true;
                $rootScope.pageTitle = $rootScope.loc.ID_CARD;
                $rootScope.leftNavButton = $rootScope.leftNavButtonType.HOME;

                /**
                 * Retrieves the page HTML from the page service. Called on view load.
                 *
                 * @memberof IdCardController
                 * @method getPage
                 */
                $scope.getPage = function() {
                  /**
                  * The directive HTML for the page.
                  *
                  * @memberof IdCardController
                  * @member {String} pageHtml
                  */
                  $scope.pageHtml = '';

                  var pageName = 'id-card';
                  var query = {
                    policyIndex: $rootScope.policyIndex,
                    url: $location.path(),
                    policyEffectiveDate : $rootScope.selectedPolicy.effectiveDate,
                    policyExpirationDate : $rootScope.selectedPolicy.expirationDate,
                    policyExternalId : $rootScope.selectedPolicy.externalId,
                  };

                  $rootScope.$emit('pageLoading');
                  pageService.getPage(pageService.devices.MOBILE, pageName, $rootScope.language, query).then(function(pageHtml) {
                    $rootScope.$emit('pageLoaded');
                    $scope.pageHtml = pageHtml;
                    adobeService.trackState(pageName, analyticConstants.IDCARD_SECTION);
                    adobeService.trackAction(pageName, analyticConstants.IDCARD_SECTION); // custom metrics requires action
                  }, function() {
                    $rootScope.$emit('pageLoaded');
                    $rootScope.showNetworkErrorAlert();
                  });
                };

                var idCardUnregisterFunc = $rootScope.$on('policySelected', function() {
                  $scope.getPage();
                });

                $rootScope.$on('LOGOUT', idCardUnregisterFunc);

                $rootScope.verifyLocaleRetrieved();
                $scope.getPage();
              }
            ]);
          }());
