import { subscribe } from "./eventBus";
import { setCookie, getCookie, validateAuthentication } from "../utilities";

export default function initServicesPlus() {
  subscribe("authenTimeoutHandler", (getState) => {
    BIP.Event.subscribe("auth.login", function (data) {
      const accountIdNew = data.authResponse.accountId;
      const accountIdOld = getCookie(".personal_accountid");
      const { credentials } = getState().app;
      const loggedin = validateAuthentication(credentials);
      if (!loggedin || accountIdNew != accountIdOld) {
        setCookie(".personal_accountid", accountIdNew, 3650);
        window.location.replace(window.personalSettings.LoginUrl);
      }
    });
    BIP.Event.subscribe("auth.logout", function (data) {
      const { credentials } = getState().app;
      const loggedin = validateAuthentication(credentials);
      if (loggedin) {
        window.location.replace(window.personalSettings.LogoutUrl);
      }
    });
    BIP.init({
      client_id: window.personalSettings.BipClientId,
      appId: window.personalSettings.BipAppId,
      server: window.personalSettings.BipAuthEndpoint,
      browserId: window.personalSettings.BrowserId,
      debug: false,
    });
  });
}
