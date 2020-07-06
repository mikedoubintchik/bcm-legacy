import * as settingsHomeTemplate from "./components/settings-home.template.html";

angular.module("account-settings").component("settingsHome", {
  template: settingsHomeTemplate.default,
  controller: [
    "$rootScope",
    function ($rootScope) {
      console.log("root scope", $rootScope);
    },
  ],
});
