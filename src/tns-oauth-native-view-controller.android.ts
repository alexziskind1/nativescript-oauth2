import * as appModule from "tns-core-modules/application";
import * as colorModule from "tns-core-modules/color";
import { Frame } from "tns-core-modules/ui/frame";
import { TnsOAuthClient, ITnsOAuthTokenResult } from "./index";
import { TnsOAuthClientLoginBlock } from "./index";
import {
  ITnsOAuthLoginController,
  TnsOAuthLoginSubController
} from "./tns-oauth-login-sub-controller";

declare var android: any;

export class TnsOAuthLoginNativeViewController
  implements ITnsOAuthLoginController {
  private loginController: TnsOAuthLoginSubController = null;

  public static initWithClient(client: TnsOAuthClient) {
    const instance = new TnsOAuthLoginNativeViewController();
    if (instance) {
      instance.loginController = new TnsOAuthLoginSubController(client);
    }
    return instance;
  }

  public loginWithParametersFrameCompletion(
    parameters,
    frame: Frame,
    urlScheme?: string,
    completion?: TnsOAuthClientLoginBlock
  ) {
    const fullUrl = this.loginController.preLoginSetup(
      frame,
      urlScheme,
      completion
    );

    this.loginInternalWithParametersCompletion(fullUrl, frame);
  }

  private loginInternalWithParametersCompletion(
    fullUrl: string,
    frame: Frame
  ): void {
    const builder = new android.support.customtabs.CustomTabsIntent.Builder();
    builder.setToolbarColor(new colorModule.Color("#335da0").android);
    builder.setShowTitle(true);
    const customTabsIntent = builder.build();
    customTabsIntent.launchUrl(
      appModule.android.startActivity,
      android.net.Uri.parse(fullUrl)
    );
  }

  public resumeWithUrl(url: string): boolean {
    return this.loginController.resumeWithUrl(
      url,
      (tokenResult: ITnsOAuthTokenResult, error) => {
        this.loginController.completeLoginWithTokenResponseError(
          tokenResult,
          error
        );
        this.loginController.frame.goBack();
      }
    );
  }
}
