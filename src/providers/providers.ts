import * as definition from "../providers";
import { ITnsOAuthTokenResult } from "../index";
import * as UrlLib from "url";
import * as Querystring from "querystring";

export class TnsOaProviderMicrosoft implements definition.TnsOaProvider {
  public options: definition.TnsOaProviderOptions;
  public openIdSupport: definition.OpenIdSupportFull = "oid-full";
  public providerType: definition.ProviderTypeMicrosoft = "microsoft";
  public authority = "https://login.microsoftonline.com/common";
  public tokenEndpointBase = "https://login.microsoftonline.com/common";
  public authorizeEndpoint = "/oauth2/v2.0/authorize";
  public tokenEndpoint = "/oauth2/v2.0/token";
  public cookieDomains = ["login.microsoftonline.com", "live.com"];

  constructor(options: definition.TnsOaProviderOptionsMicrosoft) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}

export class TnsOaProviderGoogle implements definition.TnsOaProvider {
  public options: definition.TnsOaProviderOptions;
  public openIdSupport: definition.OpenIdSupportFull = "oid-full";
  public providerType: definition.ProviderTypeGoogle = "google";
  public authority = "https://accounts.google.com/o";
  public tokenEndpointBase = "https://accounts.google.com/o";
  public authorizeEndpoint = "/oauth2/auth";
  public tokenEndpoint = "/oauth2/token";
  public cookieDomains = ["google.com"];

  constructor(options: definition.TnsOaProviderOptionsGoogle) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}

export class TnsOaProviderFacebook implements definition.TnsOaProvider {
  public options: definition.TnsOaProviderOptions;
  public openIdSupport: definition.OpenIdSupportNone = "oid-none";
  public providerType: definition.ProviderTypeFacebook = "facebook";
  public authority = "https://www.facebook.com/v3.1/dialog";
  public tokenEndpointBase = "https://graph.facebook.com";
  public authorizeEndpoint = "/oauth";
  public tokenEndpoint = "/v3.1/oauth/access_token";
  public cookieDomains = ["facebook.com"];

  constructor(options: definition.TnsOaProviderOptionsFacebook) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}

export class TnsOaProviderLinkedIn implements definition.TnsOaProvider {
  public options: definition.TnsOaProviderOptions;
  public openIdSupport: definition.OpenIdSupportNone = "oid-none";
  public providerType: definition.ProviderTypeLinkedIn = "linkedIn";
  public authority = "https://www.linkedin.com";
  public tokenEndpointBase = "https://www.linkedin.com";
  public authorizeEndpoint = "/oauth/v2/authorization";
  public tokenEndpoint = "/oauth/v2/accessToken";
  public cookieDomains = ["linkedin.com"];

  constructor(options: definition.TnsOaProviderOptionsLinkedIn) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}

export class TnsOaProviderVkontakte implements definition.TnsOaProvider {
  public options: definition.TnsOaProviderOptions;
  public openIdSupport: definition.OpenIdSupportNone = "oid-none";
  public providerType: definition.ProviderTypeVkontakte = "vkontakte";
  public authority = "https://oauth.vk.com";
  public tokenEndpointBase = "https://oauth.vk.com";
  public authorizeEndpoint = "/authorize";
  public tokenEndpoint = "/access_token";
  public cookieDomains = ["oauth.vk.com"];

  constructor(options: definition.TnsOaProviderOptionsLinkedIn) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }

  public getCodeFromRedirectUrl(url: string): string {
    const parsedRetStr = UrlLib.parse(url);
    const queryFromHash = parsedRetStr.hash.slice(1);
    const qsObj = Querystring.parse(queryFromHash);
    return qsObj['code'];
  }
}
