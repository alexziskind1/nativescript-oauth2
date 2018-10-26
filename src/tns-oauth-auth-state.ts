import { TnsOAuthClientLoginBlock } from "./index";

export class TnsOAuthState {
  private _loginCompletion: TnsOAuthClientLoginBlock;
  private _codeVerifier: string;
  private _urlScheme: string;

  public authCode: string;

  public get loginCompletion(): TnsOAuthClientLoginBlock {
    return this._loginCompletion;
  }

  public get codeVerifier(): string {
    return this._codeVerifier;
  }

  public get urlScheme(): string {
    return this._urlScheme;
  }

  constructor(
    codeVerifier: string,
    loginCompletion?: TnsOAuthClientLoginBlock,
    urlScheme?: string
  ) {
    this._loginCompletion = loginCompletion;
    this._codeVerifier = codeVerifier;
    this._urlScheme = urlScheme;
  }
}
