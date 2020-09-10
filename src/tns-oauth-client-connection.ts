import * as querystring from "querystring";
import * as URL from "url";

import { Http, HttpResponse, HttpRequestOptions } from "@nativescript/core";

import {
  TnsOaOpenIdProviderOptions,
  TnsOaUnsafeProviderOptions,
} from "./providers";

import { TnsOAuthClient, TnsOAuthResponseBlock } from "./index";
import { httpResponseToToken } from "./tns-oauth-utils";

const accessTokenName = "access_token";

export class TnsOAuthClientConnection {
  private _client: TnsOAuthClient;
  private _request: HttpRequestOptions;
  private _completion: TnsOAuthResponseBlock;

  private _customHeaders: any;

  public get client(): TnsOAuthClient {
    return this._client;
  }

  public get completion() {
    return this._completion;
  }

  public static initWithRequestClientCompletion(
    // request: http.HttpRequestOptions,
    client: TnsOAuthClient,
    completion: TnsOAuthResponseBlock
  ) {
    return TnsOAuthClientConnection.initWithRequestClientFeaturesCompletion(
      // request,
      client,
      0, // No features
      completion
    );
  }

  public static initWithRequestClientFeaturesCompletion(
    // request: http.HttpRequestOptions,
    client: TnsOAuthClient,
    features,
    completion: TnsOAuthResponseBlock
  ) {
    const instance = new TnsOAuthClientConnection();

    if (instance) {
      instance._client = client;

      /*
      instance._request = TnsOAuthClientConnection.configureHeadersOnRequestWithClientWithFeatures(
        request,
        client,
        features
      );
      */

      instance._completion = completion;

      // instance._customHeaders = getAuthHeaderFromCredentials(client.provider);
    }

    return instance;
  }

  /*
  public static configureHeadersOnRequestWithClientWithFeatures(
    request: http.HttpRequestOptions,
    client: TnsOAuthClient,
    features
  ): http.HttpRequestOptions {

    return request;
  }
  */

  public startGetTokenFromCode(authCode: string) {
    this.getTokenFromCode(this.client, authCode, this.completion);
  }

  public startTokenRevocation() {
    // call revoke token here
    const revokeUrl =
      this.client.provider.authority + this.client.provider.revokeEndpoint;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const body = querystring.stringify({
      token: this.client.tokenResult.refreshToken,
    });

    Http.request({
      url: revokeUrl,
      method: "POST",
      headers: headers,
      content: body,
    }).then(
      (response: HttpResponse) => {
        if (response.statusCode !== 200) {
          this.completion(
            null,
            response,
            new Error(`Failed logout with status ${response.statusCode}.`)
          );
        } else {
          this.completion(null, response, null);
        }
      },
      (error) => this.completion(null, null, error)
    );
  }

  public startTokenRefresh() {
    const tokenUrl =
      this.client.provider.authority + this.client.provider.tokenEndpoint;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    let body = null;
    switch (this.client.provider.options.openIdSupport) {
      case "oid-full":
        const options1 = <TnsOaOpenIdProviderOptions>(
          this.client.provider.options
        );
        body = querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: this.client.tokenResult.refreshToken,
          client_id: options1.clientId,
        });
        break;
      case "oid-none":
        const options2 = <TnsOaUnsafeProviderOptions>(
          this.client.provider.options
        );
        body = querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: this.client.tokenResult.refreshToken,
          client_id: options2.clientId,
          client_secret: options2.clientSecret,
        });
    }

    Http.request({
      url: tokenUrl,
      method: "POST",
      headers: headers,
      content: body,
    }).then(
      (response: HttpResponse) => {
        if (response.statusCode !== 200) {
          this.completion(
            null,
            response,
            new Error(
              `Failed refresh token with status ${response.statusCode}.`
            )
          );
        } else {
          this.completion(null, response, null);
        }
      },
      (error) => this.completion(null, null, error)
    );
  }

  private getTokenFromCode(
    client: TnsOAuthClient,
    code: string,
    completion
  ): Promise<any> {
    let oauthParams = {
      grant_type: "authorization_code",
    };

    return this.getOAuthAccessToken(client, code, oauthParams, completion);
  }

  private getAccessTokenUrl(client: TnsOAuthClient): string {
    let oauth2 = null;

    switch (client.provider.options.openIdSupport) {
      case "oid-full":
        const options1 = <TnsOaOpenIdProviderOptions>client.provider.options;
        oauth2 = {
          clientId: options1.clientId,
          baseSite: client.provider.authority,
          baseSiteToken: client.provider.tokenEndpointBase,
          authorizePath: client.provider.authorizeEndpoint,
          accessTokenPath: client.provider.tokenEndpoint,
        };
        break;
      case "oid-none":
        const options2 = <TnsOaUnsafeProviderOptions>client.provider.options;
        oauth2 = {
          clientId: options2.clientId,
          clientSecret: options2.clientSecret,
          baseSite: client.provider.authority,
          baseSiteToken: client.provider.tokenEndpointBase,
          authorizePath: client.provider.authorizeEndpoint,
          accessTokenPath: client.provider.tokenEndpoint,
        };
    }

    const _clientId = oauth2.clientId;
    const _clientSecret = oauth2.clientSecret;
    const _baseSite = oauth2.baseSite;
    const _baseSiteToken = oauth2.baseSiteToken;
    const _authorizeUrl = oauth2.authorizePath || "/oauth/authorize";
    const _accessTokenUrl = oauth2.accessTokenPath || "/oauth/access_token";
    const _accessTokenName = "access_token";
    const _authMethod = "Bearer";
    const _useAuthorizationHeaderForGET = false;

    if (_baseSiteToken && _baseSiteToken !== "") {
      return _baseSiteToken + _accessTokenUrl;
    } else {
      return _baseSite + _accessTokenUrl;
    }
  }

  public getOAuthAccessToken(
    client: TnsOAuthClient,
    code,
    parameters,
    completion: TnsOAuthResponseBlock
  ): Promise<any> {
    const params = parameters || {};
    params["client_id"] = client.provider.options.clientId;
    if (client.provider.options.openIdSupport === "oid-none") {
      const options = <TnsOaUnsafeProviderOptions>client.provider.options;
      if (options.clientSecret && options.clientSecret !== "") {
        params["client_secret"] = options.clientSecret;
      }
    }

    const codeParam =
      params.grant_type === "refresh_token" ? "refresh_token" : "code";
    params[codeParam] = code;

    if (client.codeVerifier) {
      params["code_verifier"] = client.codeVerifier;
    }

    params["redirect_uri"] = client.provider.options.redirectUri;

    let post_data = querystring.stringify(params);

    const post_headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const accessTokenUrl = this.getAccessTokenUrl(client);

    return new Promise<any>((resolve, reject) => {
      this._createRequest("POST", accessTokenUrl, post_headers, post_data, null)
        .then((response: HttpResponse) => {
          let tokenResult = httpResponseToToken(response);
          completion(tokenResult, <any>response);
          resolve(response);
        })
        .catch((er) => {
          reject(er);
        });
    });
  }

  private _createRequest(
    method,
    url,
    headers,
    post_body,
    access_token
  ): Promise<HttpResponse> {
    const parsedUrl = URL.parse(url, true);

    const realHeaders = {};
    for (let key in this._customHeaders) {
      realHeaders[key] = this._customHeaders[key];
    }
    if (headers) {
      for (let key in headers) {
        realHeaders[key] = headers[key];
      }
    }
    realHeaders["Host"] = parsedUrl.host;

    if (access_token && !("Authorization" in realHeaders)) {
      if (!parsedUrl.query) {
        parsedUrl.query = {};
      }
      parsedUrl.query[accessTokenName] = access_token;
    }

    let queryStr = querystring.stringify(parsedUrl.query);
    if (queryStr) {
      queryStr = "?" + queryStr;
    }
    const options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + queryStr,
      method: method,
      headers: realHeaders,
    };

    return this._executeRequest(options, url, post_body);
  }

  private _executeRequest(options, url, post_body): Promise<HttpResponse> {
    const promise = Http.request({
      url: url,
      method: options.method,
      headers: options.headers,
      content: post_body,
    });
    return promise;
  }
}
