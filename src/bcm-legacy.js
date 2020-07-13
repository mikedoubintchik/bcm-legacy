import "./set-public-path";

import angular from "angular";
import singleSpaAngularJS from "single-spa-angularjs";
import uiRouter from "angular-ui-router";

const BCMLegacy = singleSpaAngularJS({
  angular,
  mainAngularModule: "account-settings",
  uiRouter: true,
  preserveGlobal: false,
  template: require("./components/account-settings.template.html").default,
  domElementGetter: function () {
    require("./account-settings.css");
    return document.getElementById("angularjs-container");
  },
});

export const bootstrap = BCMLegacy.bootstrap;
export const mount = BCMLegacy.mount;
export const unmount = BCMLegacy.unmount;
