import { Frame } from "tns-core-modules/ui/frame";
import { ITnsOAuthLoginController } from "./tns-oauth-login-sub-controller";
import { TnsOAuthClient, TnsOAuthClientLoginBlock } from "./index";

export declare class TnsOAuthLoginNativeViewController
  implements ITnsOAuthLoginController {
  static initWithClient(client: TnsOAuthClient);
  loginWithParametersFrameCompletion(
    parameters: any,
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLoginBlock
  );
  resumeWithUrl(url: string);
}
