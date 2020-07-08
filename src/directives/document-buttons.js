/**
 * Directive for bottons that load documents.
 *
 * @namespace Directives
 * @class documentButtons
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.documentButtons', [])
  .directive('documentButtons', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/document-buttons.html',
        scope: {
          /**
          * The buttons to display.
          *
          * @memberof documentButtons
          * @member {Array} buttons
          */
          buttons: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          '$window',
          'restService',
          'adobeService',
          function($scope, $rootScope, $location, $window, restService, adobeService) {
            var VIEWSTATE = {
              INITIAL   : 'INITIAL',
              PROCESSING: 'PROCESSING',
              FINAL     : 'FINAL',
              ERROR     : 'ERROR'
            };

            $scope.loc        = $rootScope.loc;
            $scope.gotoView   = $rootScope.gotoView;
            $scope.foundEOB   = null;
            $scope.EOBState   = VIEWSTATE.INITIAL; //Default value for the specific button

            /**
             * The onClick method for the Viewing benefits coverages and documents.
             *
             * @memberof documentButtons
             * @method viewCoverages
             * @param  {String} buttonId The button ID defined in station.
             */
            $scope.viewCoverages = function(buttonId) {
              $scope.trackButtonAction('benefitsViewCoverageDetails');
              $rootScope.gotoView('/benefits/viewcoverage');
            };

            /**
             * The onClick method for the View Total Benefits button.
             *
             * @memberof documentButtons
             * @method viewBenefits
             * @param  {String} buttonId The button ID defined in station.
             */
            $scope.viewBenefits = function(buttonId) {
              $rootScope.gotoView('/benefits');
            };

            $scope.trackButtonAction = function(action){
              adobeService.trackAction(action, $scope.buttons[0].section);
            }

            /**
             * The onClick method for the EOB button.
             *
             * @memberof documentButtons
             * @method viewEOB
             * @param  {String} buttonId The button ID defined in station.
             */
            $scope.viewEOB = function(buttonId) {
              if ($scope.EOBState === VIEWSTATE.INITIAL) {
                $rootScope.pausedForReadPDF = true;
                $scope.trackButtonAction('claimDetails:eob:load');
                loadEOBDocument(buttonId, $scope.EOBState);
              }
              else if ($scope.EOBState === VIEWSTATE.FINAL) {
                //User has pressed button to retrieve document
                displayEOBDocument();
              }
            };

            var loadEOBDocument = function(buttonId, currentState) {
              if (currentState === VIEWSTATE.INITIAL) {
                $scope.EOBState = VIEWSTATE.PROCESSING;

                angular.element('#'+buttonId + ' #span' + buttonId).html($rootScope.loc.LOADING_PLEASE_WAIT);
                angular.element('#'+buttonId + ' #icon' + buttonId).removeClass("fc-pdf").addClass("fa fa-2x fa-spinner fa-pulse");

                var query = $location.search();

                var queryData = "policyindex=" + $rootScope.policyIndex +
                "&policyExternalId=" + $rootScope.selectedPolicy.externalId +
                "&policyEffectiveDate=" + $rootScope.selectedPolicy.effectiveDate +
                "&policyExpirationDate=" + $rootScope.selectedPolicy.expirationDate +
                "&dependentNo=" + query.dependentNo +
                "&docType=EOB" + "&claimId="+ query.id +
                "&url="+ $location.path();

                //Grab the data from service
                restService.getData('documents?' + queryData, $rootScope.language || 'en').then(function(docBytes) {
                  return docBytes;
                }).then(function(docBytes) {
                  if (docBytes) {
                    angular.element('#'+buttonId).addClass("sync-benefits-pdf")
                    angular.element('#'+buttonId + ' #span' + buttonId).html($rootScope.loc.EOB_PDF + '<i class=\'fc-pdf fc-lg\' ng-click="trackButtonAction(\'readyViewEOB\', \'Claims-Details\')"></i>'+'<hr/>'+$rootScope.loc.READY_TO_VIEW);
                    angular.element('#'+buttonId + ' #icon' + buttonId).removeClass("fa fa-2x fa-spinner fa-pulse");

                    $scope.foundEOB = docBytes[0].documentImageBlob;

                    $scope.EOBState = VIEWSTATE.FINAL;
                  }
                },function(error) {
                  $scope.EOBState = VIEWSTATE.ERROR;

                  angular.element('#'+buttonId).addClass("error-benefits-pdf")
                  angular.element('#'+buttonId + ' #span' + buttonId).html($rootScope.loc.EOB_PDF + '<i class=\'fc-pdf fc-lg\'></i>'+'<hr/><span class="pdf-warn">'+$rootScope.loc.DOCUMENT_NOT_FOUND + '</span>');
                  angular.element('#'+buttonId + ' #icon' + buttonId).removeClass("fa fa-2x fa-spinner fa-pulse");
                });
              }
            };

            var displayEOBDocument = function() {
              $scope.trackButtonAction('claimDetails:eob:view');
              if(typeof cordova !== 'undefined') {
                DocumentViewer.saveAndPreviewBase64File(function(success) {}, function(err) {
                  console.log(err);
                }, $scope.foundEOB, 'application/pdf', cordova.file.cacheDirectory, 'preview.pdf');
              }
            };
          }
        ]
      };
    }
  ]);
}());
