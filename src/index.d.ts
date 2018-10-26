/// <reference path="./providers/providers.d.ts" />
import { Frame } from "tns-core-modules/ui/frame";
import { LoadEventData } from "tns-core-modules/ui/web-view/web-view";
import { HttpResponse } from "tns-core-modules/http/http";
import { TnsOaProvider, TnsOaProviderType } from "./providers";

export declare interface ITnsOAuthTokenResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
}

export type TnsOAuthClientLoginBlock = (
  tokenResult: ITnsOAuthTokenResult,
  error
) => void;
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
  constructor(providerType: TnsOaProviderType);
  loginWithCompletion(completion?: TnsOAuthClientLoginBlock): void;
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
  resumeWithUrl(url: string);
}
