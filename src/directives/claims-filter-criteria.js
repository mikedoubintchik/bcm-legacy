/**
 * Directive for claims filter button
 *
 * @namespace Directives
 * @class claimsFilterButton
 */
(function() {
  'use strict';

  angular.module('blueconnect.mobile.directives.claimsFilterCriteria', [

  ])
  .directive('claimsFilterCriteria', [
    function() {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'partials/claims-filter-criteria.html',
        scope: {
          members: '='
        },
        controller: [
          '$scope',
          '$rootScope',
          '$location',
          'claimsService',
          'adobeService',
          function($scope, $rootScope, $location, claimsService, adobeService) {
            $scope.claimsFilter = {
              'isSelected'  : 'false',
              'claimsStatus': '',
              'startMonth'  : '',
              'endMonth'    : ''
            };

            $scope.loc                = $rootScope.loc;
            $scope.gotoView           = $rootScope.gotoView;
            $scope.filteredDates      = claimsService.generateFilterDates($rootScope.selectedPolicy);
            $scope.selection          = claimsService.initializeMemberList($scope.members, true);
            $scope.claimStatusButtons = [];

            var button1 = {'name': 'claimstatusradio', 'label':$rootScope.loc.ANY_STATUS,'value':'ALL','status':true};
            var button2 = {'name': 'claimstatusradio', 'label':$rootScope.loc.PROCESSED_STATUS,'value':'PROCESSED','status':false};
            var button3 = {'name': 'claimstatusradio', 'label':$rootScope.loc.PENDING_STATUS,'value':'PROCESSING','status':false};

            $scope.claimStatusButtons.push(button1);
            $scope.claimStatusButtons.push(button2);
            $scope.claimStatusButtons.push(button3);

            $scope.keyword = $location.search().keyword || '';

            /**
            * This method toggles the member selection on/off. It is used by the checkbox directive.
            *
            * @memberof claimsFilterCriteria
            * @member {String} memberName  The name value for the member being chosen.
            */
            $scope.toggleSelection = function toggleSelection(memberName) {
               var index = $scope.selection.indexOf(memberName);
           
               // is currently selected
               if (index > -1) {
                 $scope.selection.splice(index, 1);
               }
           
               // is newly selected
               else {
                 $scope.selection.push(memberName);
               }
            };

          /**
           * This method is a pass through to the service method perfoming the filtering. See
           * claimsService.generateFilterQuery.
           *
           * @memberof claimsFilterCriteria
           * @method generateFilterQuery
           * @param  {Object}  selection         The holding area for those member's selected.
           * @param  {String}  claimsStatus      The selected status for the claim.
           * @param  {Date}    startMonth        The starting filter date.
           * @param  {Date}    endMonth          The ending filter date.
           * @param  {Date}    effectiveDate     The currently selected policy's start date.
           * @param  {Date}    expirationDate    The currently selected policy's end date.
           * @param  {String}  keyword           The user entered search term.
           */
            $scope.filterClaims = function() {
              var queryPath = claimsService.generateFilterQuery($scope.selection, $scope.claimsFilter.claimsStatus, $scope.claimsFilter.startMonth, $scope.claimsFilter.endMonth, $rootScope.selectedPolicy.effectiveDate, $rootScope.selectedPolicy.expirationDate, $scope.keyword);

              $rootScope.gotoView('/claims/search?' + queryPath);
            };


            /**
             * This method is called on the ng-change of the fitler dates. It is used to not allow the form
             * to be submitted if the date range is invalid.
             *
             * @memberof claimsFilterCriteria
             * @method validateDates
             */
            $scope.validateDates = function() {
              if ($scope.claimsFilter.endMonth < $scope.claimsFilter.startMonth) {
                $scope.claimsFilterForm.$invalid = true;
              }
            };
          }
        ]
      };
    }
  ]);
}());
