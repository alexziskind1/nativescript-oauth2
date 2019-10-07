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
    // const request: HttpRequestOptions = null;

    // Call the token endpoint for code exchange.
    // If response is 200 OK, dismiss safari view controller and call login
    // completion with tokenResult.
    // If response is non-400 error, dismiss safari view controller and
    // call login completion with response error.
    // Ignore 400 error. It means something wrong with code exchange, could be a malicious caller
    // with a bogus code verifier.

    let responseCompletion: TnsOAuthResponseBlock;

    if (completion) {
      responseCompletion = (
        data: any,
        response: HttpResponse,
        responseError: Error
      ) => {
        if (!responseError) {
          if (response.statusCode === 200) {
            const tokenResult = this.client.provider.parseTokenResult(data);

            if (tokenResult && !responseError) {
              this.client.tokenResult = tokenResult;
              completion(tokenResult, responseError);
            }
          } else if (response.statusCode === 400) {
            console.error("400 ERRROR Occurred");
            // A 400 error can be due to an malformed request to the server by the SDK OR a malicious caller
            // with an invalid auth code. At this point the server intentionally omit the detailed reason
            // of the 400. We always assume the 400 is caused by a malicious caller and ignore it silently.
            // Handling 400 error and notifying the user would mess up the auth flow and make the app
            // less secure.
            completion(null, responseError);
          } else if (response.statusCode > 400) {
            // A non-400 error is unlikely to be caused by a malicious caller with an invalid auth code.
            // So we don't ignore such error.

            // Set responseError
            completion(null, responseError);
          }
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
    const loginCompletion: TnsOAuthClientLoginBlock = this.authState
      .loginCompletion;
    this.authState = null;
    loginCompletion(tokenResult, responseError);
  }
}
