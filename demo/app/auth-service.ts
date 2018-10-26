import { TnsOAuthClient, configureTnsOAuth } from "nativescript-oauth";
import {
  TnsOaProvider,
  TnsOaProviderOptionsFacebook,
  TnsOaProviderFacebook
} from "nativescript-oauth/providers";

let client: TnsOAuthClient = null;

export function configureOAuthProviders() {
  // const microsoftProvider = configureOAuthProviderMicrosoft();
  // const googleProvider = configureOAuthProviderGoogle();
  const facebookProvider = configureOAuthProviderFacebook();

  configureTnsOAuth([
    // microsoftProvider,
    // googleProvider,
    facebookProvider
  ]);
}

function configureOAuthProviderFacebook(): TnsOaProvider {
  const facebookProviderOptions: TnsOaProviderOptionsFacebook = {
    openIdSupport: "oid-none",
    clientId: "691208554415645",
    clientSecret: "d8725ac416fa1bb1917ccffd1670e3c6",
    redirectUri: "https://www.facebook.com/connect/login_success.html",
    scopes: ["email"]
  };
  const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
  return facebookProvider;
}

export function tnsOauthLogin(providerType) {
  client = new TnsOAuthClient(providerType);
}

export function tnsOauthLogout() {
  if (client) {
    client.logout();
  }
}
