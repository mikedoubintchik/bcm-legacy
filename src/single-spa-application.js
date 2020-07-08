import singleSpaAngularJS from "single-spa-angularjs";
import angular from "angular";
import uiRouter from 'angular-ui-router';

const BCMLegacy = singleSpaAngularJS({
  angular: angular,
  mainAngularModule: "blueconnect.mobile.app",
  uiRouter: true,
  preserveGlobal: false,
  template: "<account-settings />",
});

export const bootstrap = BCMLegacy.bootstrap;
export const mount = BCMLegacy.mount;
export const unmount = BCMLegacy.unmount;
