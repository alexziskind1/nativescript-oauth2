import { TnsOAuthClientLoginBlock } from "./index";

export class TnsOAuthState {
  private _loginCompletion: TnsOAuthClientLoginBlock;
  private _codeVerifier: string;
  private _urlScheme: string;
  private _isLogout: boolean;

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

  public get isLogout(): boolean {
    return this._isLogout;
  }

  constructor(
    codeVerifier: string,
    isLogout: boolean,
    loginCompletion?: TnsOAuthClientLoginBlock,
    urlScheme?: string
  ) {
    this._loginCompletion = loginCompletion;
    this._codeVerifier = codeVerifier;
    this._urlScheme = urlScheme;
    this._isLogout = isLogout;
  }
}
