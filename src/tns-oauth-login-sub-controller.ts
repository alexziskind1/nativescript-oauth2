import { HttpResponse } from "tns-core-modules/http";
import { Frame } from "tns-core-modules/ui/frame";
import { ITnsOAuthTokenResult, TnsOAuthClient, TnsOAuthClientLoginBlock, TnsOAuthResponseBlock } from "./index";
import { getCodeVerifier, sha256base64encoded } from "./pkce-util";
import { TnsOAuthState } from "./tns-oauth-auth-state";
import { TnsOAuthClientConnection } from "./tns-oauth-client-connection";
import { authorizationCodeFromRedirectUrl, getAccessTokenUrlWithCodeStr, getAuthUrlStr, getLogoutUrlStr } from "./tns-oauth-utils";

export interface ITnsOAuthLoginController {
  loginWithParametersFrameCompletion(
    parameters,
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLoginBlock
  );
  resumeWithUrl(url: string);
}

export class TnsOAuthLoginSubController {
  public authState: TnsOAuthState;
  public client: TnsOAuthClient;
  public frame: Frame;

  constructor(client: TnsOAuthClient) {
    this.client = client;
  }

  public preLoginSetup(
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLoginBlock
  ): string {
    this.frame = frame;

    if (this.authState) {
      const error = "Login failed because another login operation in progress.";
      completion(null, error);
      // return '';
    }

    let codeChallenge;
    if (this.client.pkce) {
      this.client.codeVerifier = getCodeVerifier();
      codeChallenge = sha256base64encoded(this.client.codeVerifier);
    }

    this.authState = new TnsOAuthState(
      this.client.codeVerifier, // this could be removed actually
      completion
    );

    return getAuthUrlStr(this.client.provider, codeChallenge);
  }

  public preLogoutSetup(
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthResponseBlock
  ): string {
    this.frame = frame;

    if (this.authState) {
      const error = "Logout failed because another logout operation is in progress.";
      completion(error);
    }

    this.authState = new TnsOAuthState(
      this.client.codeVerifier, // this could be removed actually
      completion
    );

    return getLogoutUrlStr(this.client.provider, this.client);
  }

  public resumeWithUrl(
    url: string,
    completion: TnsOAuthClientLoginBlock
  ): boolean {
    if (this.authState) {
      const codeExchangeRequestUrl: string = this.codeExchangeRequestUrlFromRedirectUrl(
        url
      );

      if (codeExchangeRequestUrl) {
        this.codeExchangeWithUrlCompletion(codeExchangeRequestUrl, completion);
        return true;
      }
    }

    return false;
  }

  private codeExchangeRequestUrlFromRedirectUrl(url: string): string {
    let codeExchangeUrl: string = null;
    const isRedirectUrlValid = true; // TODO: check URL validity

    if (isRedirectUrlValid) {
      const authorizationCode: string = authorizationCodeFromRedirectUrl(url);

      if (authorizationCode) {
        this.authState.authCode = authorizationCode;

        codeExchangeUrl = getAccessTokenUrlWithCodeStr(
          this.client.provider,
          authorizationCode
        );
      }
    }
    return codeExchangeUrl;
  }

  private codeExchangeWithUrlCompletion(
    url: string,
    completion: TnsOAuthClientLoginBlock
  ) {
    // Call the token endpoint for code exchange.
    // If response is 200 OK, dismiss view controller and call login
    // completion with tokenResult.
    // If a accessToken is in the result (data) and there is no responseError,
    // call loginCompletion with tokenResult

    let responseCompletion: TnsOAuthResponseBlock;

    if (completion) {
      responseCompletion = (
        data: any,
        response: HttpResponse,
        responseError: Error
      ) => {
        if ((response.statusCode === 200 || (data && data.accessToken)) && !responseError) {
          const tokenResult = this.client.provider.parseTokenResult(data);
          this.client.tokenResult = tokenResult;
          completion(tokenResult, null);
        }
        else {
          const msg = `${response ? response.statusCode : ''} ERRROR Occurred`;
          console.error(msg);
          completion(null, responseError ? responseError : new Error(msg));
        }
      };
    }

    const connection: TnsOAuthClientConnection = TnsOAuthClientConnection.initWithRequestClientCompletion(
      // request,
      this.client,
      responseCompletion
    );

    connection.startGetTokenFromCode(this.authState.authCode);
  }

  public completeLoginWithTokenResponseError(
    tokenResult: ITnsOAuthTokenResult,
    responseError
  ) {
    if (this.authState) {
      const loginCompletion: TnsOAuthClientLoginBlock = this.authState
        .loginCompletion;
      this.authState = null;
      loginCompletion(tokenResult, responseError);
    }
  }
}
