import {
  Application,
  Frame,
  HttpResponse,
  LoadEventData,
} from "@nativescript/core";
import { TnsOaProvider, TnsOaProviderType } from "./providers";

export declare interface ITnsOAuthTokenResult {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
  idTokenExpiration: Date;
}

export type TnsOAuthClientLoginBlock = (
  tokenResult: ITnsOAuthTokenResult,
  error
) => void;
export type TnsOAuthClientLogoutBlock = (error) => void;
export type TnsOAuthPageLoadStarted = (args: LoadEventData) => void;
export type TnsOAuthPageLoadFinished = (args: LoadEventData) => void;

export type TnsOAuthResponseBlock = (
  data?: any,
  response?: HttpResponse,
  error?: Error
) => void;

export declare class TnsOAuthClient {
  // private loginController;
  provider: TnsOaProvider;
  tokenResult: ITnsOAuthTokenResult;
  codeVerifier?: string;
  pkce?: boolean;
  constructor(providerType: TnsOaProviderType, pkce?: boolean);
  loginWithCompletion(completion?: TnsOAuthClientLoginBlock): void;
  logoutWithCompletion(completion?: TnsOAuthResponseBlock): void;
  refreshTokenWithCompletion(completion?: TnsOAuthClientLoginBlock): void;
  resumeWithUrl(url: string): void;
  logout(successPage?: string): void;
  // private removeCookies();
  // private removeToken();
  // private callRevokeEndpoint();
}

export function configureTnsOAuth(providers: TnsOaProvider[]): void;

export interface ITnsOAuthLoginController {
  loginWithParametersFrameCompletion(
    parameters,
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLoginBlock
  );
  logoutWithParametersFrameCompletion(
    parameters,
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLogoutBlock
  );
  resumeWithUrl(url: string);
}
