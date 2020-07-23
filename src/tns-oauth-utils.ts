import * as http from "@nativescript/core/http";
import * as querystring from "querystring";
import * as UrlLib from "url";
import { TnsOaProvider } from "./providers";
import { ITnsOAuthTokenResult } from ".";
import { TnsOAuthClient } from "./index";
const jws = require("./jws");

function addCustomQueryParams(params: object, provider: TnsOaProvider): void {
  const customQueryParams = provider.options.customQueryParams;
  if (customQueryParams) {
    for (const paramName of Object.keys(customQueryParams)) {
      params[paramName] = customQueryParams[paramName];
    }
  }
}

export function getAuthUrlStr(provider: TnsOaProvider, codeChallenge?: string): string {
  if (provider.getAuthUrlStr) {
    return provider.getAuthUrlStr();
  }
  const params = {};
  params["client_id"] = provider.options.clientId;
  params["response_type"] = "code";
  params["redirect_uri"] = provider.options.redirectUri;
  params["scope"] = provider.options.scopes && provider.options.scopes.join(' ');
  params["response_mode"] = "query";
  params["state"] = "abcd";

  if (codeChallenge) {
    params["code_challenge"] = codeChallenge;
    params["code_challenge_method"] = "S256";
  }

  addCustomQueryParams(params, provider);

  const pararmsStr = querystring.stringify(params);

  const retAuthUrlStr =
    provider.authority + provider.authorizeEndpoint + "?" + pararmsStr;
  return retAuthUrlStr;
}

export function getLogoutUrlStr(provider: TnsOaProvider, client: TnsOAuthClient): string {
  if (provider.getLogoutUrlStr) {
    return provider.getLogoutUrlStr();
  }

  if (!client || !client.tokenResult) {
    return null;
  }

  const params = {};
  params["id_token_hint"] = client.tokenResult.idToken;
  params["post_logout_redirect_uri"] = provider.options.redirectUri;

  addCustomQueryParams(params, provider);

  const pararmsStr = querystring.stringify(params);

  const retAuthUrlStr =
    provider.authority + provider.endSessionEndpoint + "?" + pararmsStr;
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
  // params["response_type"] = "code";
  // params["redirect_uri"] = credentials.redirectUri;
  params["scope"] = provider.options.scopes && provider.options.scopes.join(' ');
  // params["response_mode"] = "query";
  params["state"] = "abcd";

  addCustomQueryParams(params, provider);

  const pararmsStr = querystring.stringify(params);

  const paramsWithRedirectStr =
    pararmsStr + "&redirect_uri=" + provider.options.redirectUri;

  const retAccessTokenWithCodeUrlStr =
    getAccessTokenUrlStr(provider) + "?" + paramsWithRedirectStr;

  return retAccessTokenWithCodeUrlStr;
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

export function httpResponseToToken(response: http.HttpResponse, tKeys: http.HttpResponse): ITnsOAuthTokenResult {
  let results;
  let tokenKeys;
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
  try {
    tokenKeys = tKeys.content.toJSON()["keys"];
  } catch (e) {
    tokenKeys = querystring.parse(tKeys.content.toString())["keys"];
  }
  let access_token = results["access_token"];
  let refresh_token = results["refresh_token"];
  let id_token = results["id_token"];
  let expires_in = results["expires_in"];
  delete results["refresh_token"];

  let expSecs = Math.floor(parseFloat(expires_in));
  let expDate = new Date();
  expDate.setSeconds(expDate.getSeconds() + expSecs);

  const decoded = jws.jwsDecode(id_token);
  const id_token_data = decoded["payload"];
  const id_token_header = decoded["header"];
  const id_token_signature = decoded["signature"];
  const id_token_kid = id_token_header["kid"];
  console.log(id_token_header);
  console.log(id_token_data);
  console.log(id_token_signature);

  let key;
  for ( var c = 0; c < (tokenKeys.length-1); c++) {
    if ( tokenKeys[c]["kid"] === id_token_kid ) {
      key = tokenKeys[c];
      continue;
    }
  }

  console.log("KEY: ", key);

  //TODO PERA
  //const decoded_token = jws.jwsVerify(id_token, id_token_header["alg"], key);
  //console.log(decoded_token);

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    idToken: id_token,
    idTokenData: id_token_data,
    accessTokenExpiration: expDate,
    refreshTokenExpiration: expDate,
    idTokenExpiration: expDate
  };
}
export function getParamsFromURL(url: string): any {
  if (!url) {
      return {};
  }
  const at = url.indexOf('?');
  const a = url.substring(at + 1);
  const pairs = a.split('&');
  let i = 0;
  const urlparams = {};
  for (i = 0; i < pairs.length; i++) {
      if (pairs[i].indexOf('=') === -1) continue;
      const params_individual = pairs[i].split('=');
      urlparams[params_individual[0]] = decodeURIComponent(params_individual[1]);
  }
  return urlparams;
}
