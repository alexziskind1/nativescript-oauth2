import * as platformModule from "tns-core-modules/platform";
import * as frameModule from "tns-core-modules/ui/frame";
import { HttpResponse } from "tns-core-modules/http";

import {
  TnsOAuthClientLoginBlock,
  ITnsOAuthLoginController,
  TnsOAuthResponseBlock,
  TnsOAuthClientLogoutBlock
} from "./index";
import { TnsOaProvider, TnsOaProviderType } from "./providers";
import { TnsOAuthClientAppDelegate } from "./delegate";
import { TnsOAuthLoginNativeViewController } from "./tns-oauth-native-view-controller";
import { TnsOAuthLoginWebViewController } from "./tns-oauth-login-webview-controller";
import { TnsOAuthClientConnection } from "./tns-oauth-client-connection";
import {
  nsArrayToJSArray,
  jsArrayToNSArray,
  httpResponseToToken
} from "./tns-oauth-utils";

export interface ITnsOAuthTokenResult {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  idTokenData: string;
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
  idTokenExpiration: Date;
}

export interface ITnsOAuthIdTokenResult {
  email?: string;
  client_id?: string;
  online_account_id?: string;
  account_id?: string;
  brand?: string;
}
export class TnsOAuthClient {
  public provider: TnsOaProvider = null;
  private loginController: ITnsOAuthLoginController;
  public tokenResult: ITnsOAuthTokenResult;

  public constructor(providerType: TnsOaProviderType, private ecid: string, public pkce: boolean = true) {
    this.provider = tnsOauthProviderMap.providerMap.get(providerType);
    if (this.provider) {
      switch (this.provider.options.openIdSupport) {
        case "oid-full":
          TnsOAuthClientAppDelegate.setConfig(
            this,
            (<any>this.provider.options).urlScheme
          );
          this.loginController = TnsOAuthLoginNativeViewController.initWithClient(
            this
          );
          break;
        case "oid-none":
          this.loginController = TnsOAuthLoginWebViewController.initWithClient(
            this
          );
          break;
        default:
          this.loginController = TnsOAuthLoginWebViewController.initWithClient(
            this
          );
          break;
      }
    }
  }

  public getEcid() {
    return this.ecid;
  }

  public loginWithCompletion(completion?: TnsOAuthClientLoginBlock) {
    if (this.provider) {
      this.loginController.loginWithParametersFrameCompletion(
        null,
        frameModule.topmost(),
        (<any>this.provider.options).urlScheme,
        completion
      );
    } else {
      completion(null, "Provider is not configured");
    }
  }

  public logoutWithCompletion(completion?: TnsOAuthClientLogoutBlock) {
    if (this.provider) {
      this.loginController.logoutWithParametersFrameCompletion(
        null,
        frameModule.topmost(),
        (<any>this.provider.options).urlScheme,
        completion
      );
    } else {
      completion("Provider is not configured");
    }
  }

  public refreshTokenWithCompletion(completion?: TnsOAuthClientLoginBlock) {
    if (this.provider) {
      this.callRefreshEndpointWithCompletion(completion);
    } else {
      completion(null, "Provider is not configured");
    }
  }

  public logout() {
    this.callRevokeEndpoint();
    this.removeCookies();
    this.removeToken();
  }

  public resumeWithUrl(url: string) {
    this.loginController.resumeWithUrl(url);
  }

  private removeCookies(): void {
    if (platformModule.isIOS) {
      let cookieArr = nsArrayToJSArray(
        NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies
      );
      for (let i = 0; i < cookieArr.length; i++) {
        const cookie: NSHTTPCookie = <NSHTTPCookie>cookieArr[i];
        for (let j = 0; j < this.provider.cookieDomains.length; j++) {
          if (cookie.domain.endsWith(this.provider.cookieDomains[j])) {
            NSHTTPCookieStorage.sharedHTTPCookieStorage.deleteCookie(cookie);
          }
        }
      }

      const dataStore = WKWebsiteDataStore.defaultDataStore();
      dataStore.fetchDataRecordsOfTypesCompletionHandler(
        WKWebsiteDataStore.allWebsiteDataTypes(),
        records => {
          const cookieArr = <WKWebsiteDataRecord[]>nsArrayToJSArray(records);

          for (let k = 0; k < cookieArr.length; k++) {
            const cookieRecord = cookieArr[k];
            for (let l = 0; l < this.provider.cookieDomains.length; l++) {
              if (
                cookieRecord.displayName.endsWith(
                  this.provider.cookieDomains[l]
                )
              ) {
                dataStore.removeDataOfTypesForDataRecordsCompletionHandler(
                  cookieRecord.dataTypes,
                  jsArrayToNSArray([cookieRecord]),
                  () => {
                    console.log(
                      `Cookies for ${
                        cookieRecord.displayName
                      } deleted successfully`
                    );
                  }
                );
              }
            }
          }
        }
      );
    } else if (platformModule.isAndroid) {
      let cookieManager = android.webkit.CookieManager.getInstance();
      if ((<any>cookieManager).removeAllCookies) {
        let cm23 = <any>cookieManager;
        cm23.removeAllCookies(null);
        cm23.flush();
      } else if (cookieManager.removeAllCookie) {
        cookieManager.removeAllCookie();
        cookieManager.removeSessionCookie();
      }
    }
  }

  private removeToken(): void {
    this.tokenResult = null;
  }

  private callRevokeEndpoint() {
    if (!this.provider.revokeEndpoint) {
      return;
    }

    // const request = null;
    let responseCompletion: TnsOAuthResponseBlock = (
      data: any,
      response: HttpResponse,
      responseError: Error
    ) => {
      if (!responseError) {
        if (response.statusCode === 200) {
        } else {
          // Error condition - ignore
        }
      }
    };

    const connection: TnsOAuthClientConnection = TnsOAuthClientConnection.initWithRequestClientCompletion(
      // request,
      this,
      responseCompletion
    );

    connection.startTokenRevocation();
  }

  private callRefreshEndpointWithCompletion(
    completion?: TnsOAuthClientLoginBlock
  ) {
    if (!this.provider.tokenEndpoint) {
      return;
    }
    if (!this.tokenResult) {
      return;
    }

    const connection: TnsOAuthClientConnection = TnsOAuthClientConnection.initWithRequestClientCompletion(
      this,
      (data, result, error) => {
        if (result) {
          if (!error) {
            const tokenResult = httpResponseToToken(result);
            // let's retain the refresh token
            if (!tokenResult.refreshToken && this.tokenResult) {
              tokenResult.refreshToken = this.tokenResult.refreshToken;
              tokenResult.refreshTokenExpiration = this.tokenResult.refreshTokenExpiration;
            }
            this.tokenResult = tokenResult;
          }
        }
        completion(this.tokenResult, error);
      }
    );

    connection.jwksValidattion(this.provider.options.jwksEndpoint, this.tokenResult.idToken);
    connection.startTokenRefresh();
  }
}

export class TnsOauthProviderMap {
  public providerMap: Map<TnsOaProviderType, TnsOaProvider>;

  constructor() {
    this.providerMap = new Map();
  }

  public addProvider(providerType: TnsOaProviderType, provider: TnsOaProvider) {
    this.providerMap.set(providerType, provider);
  }
}

export const tnsOauthProviderMap = new TnsOauthProviderMap();

export function configureTnsOAuth(providers: TnsOaProvider[]) {
  if (platformModule.isIOS) {
    if (providers.some(p => p.options.openIdSupport === "oid-full")) {
      TnsOAuthClientAppDelegate.doRegisterDelegates();
    }
  }

  for (let i = 0; i < providers.length; ++i) {
    tnsOauthProviderMap.addProvider(providers[i].providerType, providers[i]);
  }
}
