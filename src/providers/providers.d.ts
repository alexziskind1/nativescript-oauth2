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

export declare type ProviderTypeFacebook = "facebook";
export interface TnsOaProviderOptionsFacebook
  extends TnsOaUnsafeProviderOptions { }
export declare class TnsOaProviderFacebook implements TnsOaProvider {
  options: TnsOaProviderOptions;
  openIdSupport: OpenIdSupportNone;
  providerType: ProviderTypeFacebook;
  authority: string;
  tokenEndpointBase: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  cookieDomains: string[];
  constructor(options: TnsOaProviderOptionsFacebook);
  parseTokenResult(jsonData: any): ITnsOAuthTokenResult;
}

export declare type ProviderTypeGoogle = "google";
export interface TnsOaProviderOptionsGoogle
  extends TnsOaOpenIdProviderOptions { }
export declare class TnsOaProviderGoogle implements TnsOaProvider {
  options: TnsOaProviderOptions;
  openIdSupport: OpenIdSupportFull;
  providerType: ProviderTypeGoogle;
  authority: string;
  tokenEndpointBase: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  cookieDomains: string[];
  constructor(options: TnsOaProviderOptionsGoogle);
  parseTokenResult(jsonData: any): ITnsOAuthTokenResult;
}

export declare type ProviderTypeMicrosoft = "microsoft";
export interface TnsOaProviderOptionsMicrosoft
  extends TnsOaOpenIdProviderOptions { }
export declare class TnsOaProviderMicrosoft implements TnsOaProvider {
  options: TnsOaProviderOptions;
  openIdSupport: OpenIdSupportFull;
  providerType: ProviderTypeMicrosoft;
  authority: string;
  tokenEndpointBase: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  cookieDomains: string[];
  constructor(options: TnsOaProviderOptionsMicrosoft);
  parseTokenResult(jsonData: any): ITnsOAuthTokenResult;
}

export declare type ProviderTypeLinkedIn = "linkedIn";
export interface TnsOaProviderOptionsLinkedIn
  extends TnsOaUnsafeProviderOptions { }
export declare class TnsOaProviderLinkedIn implements TnsOaProvider {
  options: TnsOaProviderOptions;
  openIdSupport: OpenIdSupportNone;
  providerType: ProviderTypeLinkedIn;
  authority: string;
  tokenEndpointBase: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  cookieDomains: string[];
  constructor(options: TnsOaProviderOptionsLinkedIn);
  parseTokenResult(jsonData: any): ITnsOAuthTokenResult;
}

export declare type ProviderTypeIdentityServer = 'identityServer';
export interface TnsOaProviderOptionsIdentityServer extends TnsOaOpenIdProviderOptions { }
export class TnsOaProviderIdentityServer implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportFull;
  public providerType: ProviderTypeIdentityServer;
  public authority;
  public tokenEndpointBase;
  public authorizeEndpoint;
  public tokenEndpoint;
  public revokeEndpoint;
  public endSessionEndpoint;
  public cookieDomains;

  constructor(options: TnsOaProviderOptionsIdentityServer);

  public parseTokenResult(jsonData: any): ITnsOAuthTokenResult;
}
