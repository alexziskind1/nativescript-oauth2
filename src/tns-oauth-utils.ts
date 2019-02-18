import * as http from "tns-core-modules/http";
import * as querystring from "querystring";
import * as UrlLib from "url";
import { TnsOaProvider } from "./providers";
import { ITnsOAuthTokenResult } from ".";

export function getAuthUrlStr(provider: TnsOaProvider): string {
  if (provider.getAuthUrlStr) {
    return provider.getAuthUrlStr();
  }
  const params = {};
  params["client_id"] = provider.options.clientId;
  params["redirect_uri"] = provider.options.redirectUri;
  params["scope"] = provider.options.scopes && provider.options.scopes.join(' ');
  params["response_mode"] = provider.options.response_mode;
  params["response_type"] = provider.options.response_type || "code";
  params["access_type"] = provider.options.access_type;
  params["login_hint"] = provider.options.login_hint;
  params["approval_prompt"] = provider.options.approval_prompt;
  params["state"] = provider.options.state || "abcd";

  const pararmsStr = querystring.stringify(params);

  let retAuthUrlStr =
    provider.authority + provider.authorizeEndpoint + "?" + pararmsStr;
    if (provider.options.custom_param){
      retAuthUrlStr += provider.options.custom_param;
    }
  return retAuthUrlStr;
}

export function authorizationCodeFromRedirectUrl(url: string): string {
  let authorizationCode: string = null;

  if (url) {
    let parsedRetStr = UrlLib.parse(url);

    let qsObj = querystring.parse(parsedRetStr.query);
    authorizationCode = qsObj["code"];
  }
  return authorizationCode;
}

export function getAccessTokenUrlStr(provider: TnsOaProvider): string {
  let retStr = "";
  if (provider.tokenEndpointBase && provider.tokenEndpointBase !== "") {
    retStr = provider.tokenEndpointBase + provider.tokenEndpoint;
  } else {
    retStr = provider.authority + provider.tokenEndpoint;
  }

  return retStr;
}

export function getAccessTokenUrlWithCodeStr(
  provider: TnsOaProvider,
  authCode: string
): string {
  if (provider.getAccessTokenUrlWithCodeStr) {
    return provider.getAccessTokenUrlWithCodeStr(authCode);
  }

  const params = {};
  params["code"] = authCode;
  params["client_id"] = provider.options.clientId;
  params["client_secret"] = (<any>provider.options).clientSecret;
  params["grant_type"] = provider.options.grant_type || "authorization_code";
  // params["response_type"] = "code";
  // params["redirect_uri"] = credentials.redirectUri;
  params["scope"] = provider.options.scopes && provider.options.scopes.join(' ');
  // params["response_mode"] = "query";
  params["state"] = provider.options.state || "abcd";

  const pararmsStr = querystring.stringify(params);

  const pararmsWithRedirectStr =
    pararmsStr + "&redirect_uri=" + provider.options.redirectUri;

  const retAccessTokenWithCodeUrlStr =
    getAccessTokenUrlStr(provider) + "?" + pararmsWithRedirectStr;

  return retAccessTokenWithCodeUrlStr;
}

export function getAccessTokenWithCodeUrl(
  provider: TnsOaProvider,
  authCode: string
): string {
  const accessUrlStr = getAccessTokenUrlWithCodeStr(provider, authCode);
  return accessUrlStr;
}

export function newUUID(a?, b?) {
  for (
    b = a = "";
    a++ < 36;
    b +=
    (a * 51) & 52
      ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
      : "-"
  );
  return b;
}

export function getAuthHeaderFromCredentials(provider: TnsOaProvider) {
  let customAuthHeader: any;
  if (provider["basicAuthHeader"]) {
    customAuthHeader = { Authorization: provider["basicAuthHeader"] };
  }

  return customAuthHeader;
}

export function nsArrayToJSArray(a) {
  const arr = [];
  if ("undefined" !== typeof a) {
    const count = a.count;
    for (let i = 0; i < count; i++) {
      arr.push(a.objectAtIndex(i));
    }
  }
  return arr;
}

export function jsArrayToNSArray<T>(str) {
  return NSArray.arrayWithArray<T>(str);
}

export function httpResponseToToken(response: http.HttpResponse): ITnsOAuthTokenResult {
  let results;
  try {
    // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
    // responses should be in JSON
    results = response.content.toJSON();
  } catch (e) {
    // .... However both Facebook + Github currently use rev05 of the spec
    // and neither seem to specify a content-type correctly in their response headers :(
    // clients of these services will suffer a *minor* performance cost of the exception
    // being thrown
    results = querystring.parse(response.content.toString());
  }
  let access_token = results["access_token"];
  let refresh_token = results["refresh_token"];
  let expires_in = results["expires_in"];
  let expires_in_sec = results["expires_in_sec"];
  // let refresh_token_expires_in = results["refresh_token_expires_in"];
  
  delete results["refresh_token"];

  let expSecs = Math.floor(parseFloat(expires_in_sec || expires_in));
  let expDate = new Date();
  expDate.setSeconds(expDate.getSeconds() + expSecs);

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    accessTokenExpiration: expDate,
    refreshTokenExpiration: expDate
  };
}
