import singleSpaAngularJS from "single-spa-angularjs";
import uiRouter from "angular-ui-router";

const BCMLegacy = singleSpaAngularJS({
  angular: window.angular,
  mainAngularModule: "account-settings",
  uiRouter: true,
  preserveGlobal: false,
  template: "<account-settings />",
});

export const bootstrap = BCMLegacy.bootstrap;
export const mount = BCMLegacy.mount;
export const unmount = BCMLegacy.unmount;
