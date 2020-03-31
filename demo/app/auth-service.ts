import {
  TnsOAuthClient,
  configureTnsOAuth,
  ITnsOAuthTokenResult
} from "@essent/nativescript-oauth2";
import {
  TnsOaProvider,
  TnsOaProviderOptionsFacebook,
  TnsOaProviderFacebook,
  TnsOaProviderOptionsGoogle,
  TnsOaProviderGoogle,
  TnsOaProviderOptionsMicrosoft,
  TnsOaProviderMicrosoft
} from "@essent/nativescript-oauth2/providers";

let client: TnsOAuthClient = null;

export function configureOAuthProviders() {
  const microsoftProvider = configureOAuthProviderMicrosoft();
  const googleProvider = configureOAuthProviderGoogle();
  const facebookProvider = configureOAuthProviderFacebook();

  configureTnsOAuth([microsoftProvider, googleProvider, facebookProvider]);
}

function configureOAuthProviderGoogle(): TnsOaProvider {
  const googleProviderOptions: TnsOaProviderOptionsGoogle = {
    openIdSupport: "oid-full",
    clientId:
      "932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb.apps.googleusercontent.com",
    redirectUri:
      "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb:/auth",
    urlScheme:
      "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb",
    scopes: ["email"]
  };
  const googleProvider = new TnsOaProviderGoogle(googleProviderOptions);
  return googleProvider;
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

function configureOAuthProviderMicrosoft(): TnsOaProvider {
  const microsoftProviderOptions: TnsOaProviderOptionsMicrosoft = {
    openIdSupport: "oid-full",
    clientId: "f376fa87-64a9-49a1-8b56-e0d48fc0810b",
    // redirectUri: "urn:ietf:wg:oauth:2.0:oob",
    redirectUri: "msalf376fa87-64a9-49a1-8b56-e0d48fc0810b://auth",
    urlScheme: "msalf376fa87-64a9-49a1-8b56-e0d48fc0810b",
    scopes: ["https://outlook.office.com/mail.read"]
  };
  const microsoftProvider = new TnsOaProviderMicrosoft(
    microsoftProviderOptions
  );
  return microsoftProvider;
}

export function tnsOauthLogin(providerType) {
  // PKCE is enabled by default, but you can pass in 'false' here if you'd like to disable it
  client = new TnsOAuthClient(providerType, true);

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

export function tnsRefreshOAuthAccessToken() {
  if (!client) {
    return;
  }

  client.refreshTokenWithCompletion((tokenResult: ITnsOAuthTokenResult, error) => {
    if (error) {
      console.error("back to main page with error: ");
      console.error(error);
    } else {
      console.log("back to main page with token: ");
      console.log(tokenResult);
    }
  });
}

export function tnsOauthLogout() {
  if (client) {
    client.logout();
  }
}
