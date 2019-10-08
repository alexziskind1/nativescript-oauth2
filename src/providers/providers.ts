import { ITnsOAuthTokenResult } from "../index";

export type OpenIdSupportNone = "oid-none";
export type OpenIdSupportFull = "oid-full";
export type OpenIdSupport = OpenIdSupportNone | OpenIdSupportFull;

export interface TnsOaProviderOptions {
  openIdSupport: OpenIdSupport;
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  customQueryParams?: { [paramName: string]: string };
}

export interface TnsOaUnsafeProviderOptions extends TnsOaProviderOptions {
  openIdSupport: "oid-none";
  clientSecret: string;
}

export interface TnsOaOpenIdProviderOptions extends TnsOaProviderOptions {
  openIdSupport: "oid-full";
  urlScheme: string;
  issuerUrl?: string; // Used for discovery, to be implemented
}

export type TnsOaProviderType = string;

export interface TnsOaProvider {
  options: TnsOaProviderOptions;
  providerType: TnsOaProviderType;

  authority: string;
  tokenEndpointBase: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  revokeEndpoint?: string;
  endSessionEndpoint?: string;
  cookieDomains: string[];

  usePKCE?: true;

  getAuthUrlStr?(): string;
  getLogoutUrlStr?(): string;
  getAccessTokenUrlWithCodeStr?(authCode: string): string;
  parseTokenResult(jsonData): ITnsOAuthTokenResult;
}

export declare type ProviderTypeMicrosoft = "microsoft";
export interface TnsOaProviderOptionsMicrosoft
  extends TnsOaOpenIdProviderOptions { }
export class TnsOaProviderMicrosoft implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportFull = "oid-full";
  public providerType: ProviderTypeMicrosoft = "microsoft";
  public authority = "https://login.microsoftonline.com/common";
  public tokenEndpointBase = "https://login.microsoftonline.com/common";
  public authorizeEndpoint = "/oauth2/v2.0/authorize";
  public tokenEndpoint = "/oauth2/v2.0/token";
  public cookieDomains = ["login.microsoftonline.com", "live.com"];

  constructor(options: TnsOaProviderOptionsMicrosoft) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}

export declare type ProviderTypeGoogle = "google";
export interface TnsOaProviderOptionsGoogle
  extends TnsOaOpenIdProviderOptions { }
export class TnsOaProviderGoogle implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportFull = "oid-full";
  public providerType: ProviderTypeGoogle = "google";
  public authority = "https://accounts.google.com/o";
  public tokenEndpointBase = "https://accounts.google.com/o";
  public authorizeEndpoint = "/oauth2/auth";
  public tokenEndpoint = "/oauth2/token";
  public cookieDomains = ["google.com"];

  constructor(options: TnsOaProviderOptionsGoogle) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }

  public getLogoutUrlStr(): string {
    // Googles implementation of the "end_session_endpoint" (not oidc compliant)
    return `https://www.google.com/accounts/Logout`;
  }
}

export declare type ProviderTypeFacebook = "facebook";
export interface TnsOaProviderOptionsFacebook
  extends TnsOaUnsafeProviderOptions { }
export class TnsOaProviderFacebook implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportNone = "oid-none";
  public providerType: ProviderTypeFacebook = "facebook";
  public authority = "https://www.facebook.com/v3.1/dialog";
  public tokenEndpointBase = "https://graph.facebook.com";
  public authorizeEndpoint = "/oauth";
  public tokenEndpoint = "/v3.1/oauth/access_token";
  public cookieDomains = ["facebook.com"];

  constructor(options: TnsOaProviderOptionsFacebook) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}

export declare type ProviderTypeLinkedIn = "linkedIn";
export interface TnsOaProviderOptionsLinkedIn
  extends TnsOaUnsafeProviderOptions { }
export class TnsOaProviderLinkedIn implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportNone = "oid-none";
  public providerType: ProviderTypeLinkedIn = "linkedIn";
  public authority = "https://www.linkedin.com";
  public tokenEndpointBase = "https://www.linkedin.com";
  public authorizeEndpoint = "/oauth/v2/authorization";
  public tokenEndpoint = "/oauth/v2/accessToken";
  public cookieDomains = ["linkedin.com"];

  constructor(options: TnsOaProviderOptionsLinkedIn) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}

export interface TnsOaProviderOptionsIdentityServer extends TnsOaOpenIdProviderOptions { }
export declare type ProviderTypeIdentityServer = 'identityServer';
export class TnsOaProviderIdentityServer implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportFull = 'oid-full';
  public providerType: ProviderTypeIdentityServer = 'identityServer';
  public authority;
  public tokenEndpointBase;
  public authorizeEndpoint = '/connect/authorize';
  public tokenEndpoint = '/connect/token';
  public revokeEndpoint = '/connect/revocation';
  public endSessionEndpoint = '/connect/endsession';
  public cookieDomains;

  constructor(
    options: TnsOaProviderOptionsIdentityServer
  ) {
    this.options = options;
    this.authority = options.issuerUrl;
    this.tokenEndpointBase = options.issuerUrl;

    const match = /^https:\/\/(.*?)$/.exec(options.issuerUrl);
    if (match) {
      this.cookieDomains = [match[1].toString()];
    }
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}
