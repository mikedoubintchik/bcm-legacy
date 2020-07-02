// System.register([], function (_export, _context) {
//   window.accountSettingsBaseDir = _context.meta.url.slice(
//     0,
//     _context.meta.url.lastIndexOf("/") + 1
//   );

//   return {
//     execute() {
//       const link = document.createElement("link");
//       link.rel = "stylesheet";
//       link.href = accountSettingsBaseDir + "account-settings.css";
//       document.head.appendChild(link);

//       angular.module("account-settings").config([
//         "$sceDelegateProvider",
//         function ($sceDelegateProvider) {
//           $sceDelegateProvider.resourceUrlWhitelist([
//             "self",
//             window.accountSettingsBaseDir + "**",
//           ]);
//         },
//       ]);

//       const angularjsLifecycles = singleSpaAngularjs.default({
//         angular: window.angular,
//         mainAngularModule: "account-settings",
//         uiRouter: true,
//         preserveGlobal: true,
//         template: "<account-settings />",
//       });

import angular from "angular";
//       _export(angularjsLifecycles);
//     },
//   };
// });
import singleSpaAngularJS from "single-spa-angularjs";

window.BCMLegacy = singleSpaAngularjs({
  angular,
  mainAngularModule: "account-settings",
  uiRouter: true,
  preserveGlobal: false,
  template: "<account-settings />",
});

angular.module("account-settings").config([
  "$sceDelegateProvider",
  function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      "self",
      window.accountSettingsBaseDir + "**",
    ]);
  },
]);

export const bootstrap = window.BCMLegacy.bootstrap;
export const mount = window.BCMLegacy.mount;
export const unmount = window.BCMLegacy.unmount;
