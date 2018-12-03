import * as querystring from "querystring";
import * as UrlLib from "url";
import { TnsOaProvider } from "./providers";

export function getAuthUrlStr(provider: TnsOaProvider): string {
  if (provider.getAuthUrlStr) {
    return provider.getAuthUrlStr();
  }
  const params = {};
  params["client_id"] = provider.options.clientId;
  params["response_type"] = "code";
  params["redirect_uri"] = provider.options.redirectUri;
  params["scope"] = provider.options.scopes.join(' ');
  params["response_mode"] = "query";
  params["state"] = "abcd";

  const pararmsStr = querystring.stringify(params);

  const retAuthUrlStr =
    provider.authority + provider.authorizeEndpoint + "?" + pararmsStr;
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
  params["scope"] = provider.options.scopes.join(' ');
  // params["response_mode"] = "query";
  params["state"] = "abcd";

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
