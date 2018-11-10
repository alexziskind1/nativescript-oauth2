import {
  TnsOAuthClient,
  configureTnsOAuth,
  ITnsOAuthTokenResult
} from "nativescript-oauth2";
import {
  TnsOaProvider
} from "nativescript-oauth2/providers";
import { TnsOaProviderMyCustomProvider, TnsOaMyCustomProviderOptions } from "./my-oauth-provider";

let client: TnsOAuthClient = null;

export function configureOAuthProviders() {
  const myCustomProvider = configureOAuthProviderMyCustomProvider();
  configureTnsOAuth([myCustomProvider]);
}

function configureOAuthProviderMyCustomProvider(): TnsOaProvider {
  const facebookProviderOptions: TnsOaMyCustomProviderOptions = {
    openIdSupport: "oid-none",
    clientId: "691208554415645",
    clientSecret: "d8725ac416fa1bb1917ccffd1670e3c6",
    redirectUri: "https://www.facebook.com/connect/login_success.html",
    scopes: ["email"]
  };
  const facebookProvider = new TnsOaProviderMyCustomProvider(facebookProviderOptions);
  return facebookProvider;
}

export function tnsOauthLogin(providerType) {
  client = new TnsOAuthClient(providerType);

  client.loginWithCompletion((tokenResult: ITnsOAuthTokenResult, error) => {
    if (error) {
      console.error("back to main page with error: ");
      console.error(error);
    } else {
      console.log("back to main page with access token: ");
      console.log(tokenResult);
    }
  });
}

export function tnsOauthLogout() {
  if (client) {
    client.logout();
  }
}
