import { Injectable } from "@angular/core";

import {
  TnsOAuthClient,
  configureTnsOAuth,
  ITnsOAuthTokenResult
} from "nativescript-oauth2";
import {
  TnsOaProvider,
  TnsOaProviderOptionsFacebook,
  TnsOaProviderFacebook,
  TnsOaProviderOptionsGoogle,
  TnsOaProviderGoogle,
  TnsOaProviderOptionsMicrosoft,
  TnsOaProviderMicrosoft
} from "nativescript-oauth2/providers";

@Injectable()
export class AuthService {
  private client: TnsOAuthClient = null;

  constructor() {
    this.configureOAuthProviders();
  }

  public tnsOauthLogin(providerType): Promise<ITnsOAuthTokenResult> {
    this.client = new TnsOAuthClient(providerType);

    return new Promise<ITnsOAuthTokenResult>((resolve, reject) => {
      this.client.loginWithCompletion(
        (tokenResult: ITnsOAuthTokenResult, error) => {
          if (error) {
            console.error("back to main page with error: ");
            console.error(error);
            reject(error);
          } else {
            console.log("back to main page with access token: ");
            console.log(tokenResult);
            resolve(tokenResult);
          }
        }
      );
    });
  }

  public tnsOauthLogout() {
    if (this.client) {
      this.client.logout();
    }
  }

  private configureOAuthProviders() {
    const microsoftProvider = this.configureOAuthProviderMicrosoft();
    const googleProvider = this.configureOAuthProviderGoogle();
    const facebookProvider = this.configureOAuthProviderFacebook();

    configureTnsOAuth([microsoftProvider, googleProvider, facebookProvider]);
  }

  private configureOAuthProviderGoogle(): TnsOaProvider {
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

  private configureOAuthProviderFacebook(): TnsOaProvider {
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

  private configureOAuthProviderMicrosoft(): TnsOaProvider {
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
}
