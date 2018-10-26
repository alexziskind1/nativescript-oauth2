/// <reference path="./providers/providers.d.ts" />
import { TnsOaProvider, TnsOaProviderType } from "./providers";

export declare class Common {
  greet(): string;
}
export declare interface ITnsOAuthTokenResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
}
//export declare interface TnsOaProvider {}
//export declare interface TnsOaProviderType {}
export declare interface TnsOAuthClientLoginBlock {}

export declare class TnsOAuthClient {
  private loginController;
  provider: TnsOaProvider;
  tokenResult: ITnsOAuthTokenResult;
  constructor(providerType: TnsOaProviderType);
  loginWithCompletion(completion?: TnsOAuthClientLoginBlock): void;
  resumeWithUrl(url: string): void;
  logout(successPage?: string): void;
  private removeCookies();
  private removeToken();
  private callRevokeEndpoint();
}

export function configureTnsOAuth(providers: TnsOaProvider[]): void;
