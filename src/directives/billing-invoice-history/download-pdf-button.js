(function () {
  angular.module('blueconnect.mobile.directives.downloadPDFButton', [])
    .directive('downloadPdfButton', function () {
      return {
        scope: {
          invoice: '<'
        },
        controller: ['BillingInvoiceHistoryFactory', 'config', '$http', '$rootScope', '$scope',
          function (BillingInvoiceHistoryFactory, config, $http, $rootScope, $scope) {
            $scope.loc = $rootScope.loc;
            $scope.openInBrowser = $rootScope.openInBrowser;
            $scope.failedToLoad = false;
            $scope.loading = false;
            $scope.pdfReady = false;
            $scope.downloadAll = $scope.invoice.length ? true : false;

            $scope.downloadInvoice = function(invoice) {
              var serviceName = null;
              var startDate = null;
              var endDate = null;
              var body = null;
              var transactionCode = null;
              $scope.loading = true;
              $scope.pdfReady = false;
              $scope.failedToLoad = false;
              
              if ($scope.downloadAll) {
                serviceName = 'getBillingHistoryAsPdf';
                startDate = BillingInvoiceHistoryFactory.serviceFormattedSearchFromDate();
                endDate = BillingInvoiceHistoryFactory.serviceFormattedSearchToDate();
                transactionCode = 'ViewInvcPDF';
              } else {
                serviceName = 'getInvoice';
                startDate = invoice.invoiceStartDate;
                endDate = invoice.invoiceEndDate;
                transactionCode = 'ViewInvoice';
              }
              body = {
                token: BillingInvoiceHistoryFactory.getAccountToken(),
                startDate: startDate,
                endDate: endDate,
                TIPData: $rootScope.getTIPData(transactionCode, '/' + serviceName)
              };

              $http.post(config.apiUrl + '/' + serviceName, body)
                .then(function (response) {
                  $scope.loading = false;
                  if (response.status === 200 && response.data) {
                    $scope.pdfFile = 'data:application/pdf;base64,' + response.data;
                    $scope.pdfReady = true;
                  }
                })
                .catch(function (err) {
                  $scope.loading = false;
                  $scope.failedToLoad = true;
                  console.log(err);
                });
            };
            $scope.viewPdf = function () {
              var device = window.device || null;
              var devicePlatform = navigator.userAgent;
              if (device) {
                devicePlatform = device.platform;
              }
              switch(devicePlatform){
                case 'Android':
                case 'amazon-fireos':
                  /**
                  * Android devices cannot open up PDFs in a sub web view (inAppBrowser) so the PDF needs to be downloaded and then opened with whatever
                  * native PDF viewer is installed on the app.
                  */
                  $rootScope.$emit('pageLoading');
                  DocumentViewer.saveAndPreviewBase64File(
                    function (success) {
                      $rootScope.$emit('pageLoaded');
                      $rootScope.pausedForReadPDF = true;
                    },
                      function (error) {
                        console.log(error);
                        $rootScope.$emit('pageLoaded');
                    },
                    $scope.pdfFile.replace('data:application/pdf;base64,', ''), 'application/pdf', cordova.file.cacheDirectory, 'invoice-preview.pdf');
                break;

              default:
                /**
                * IOS can open PDF using openInBrowser
                */
                $scope.openInBrowser($scope.pdfFile);

                break;
              }
            };

          }
        ],
        templateUrl: 'partials/billing-invoice-history/download-pdf-button.html'
      };
    });
})();
