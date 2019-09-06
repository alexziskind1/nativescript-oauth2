import { Frame } from "tns-core-modules/ui/frame";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";
import { android as androidApp } from "tns-core-modules/application";
import { Page, isAndroid } from "tns-core-modules/ui/page";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
  TnsOAuthClient,
  ITnsOAuthTokenResult,
  TnsOAuthClientLoginBlock,
  TnsOAuthPageLoadStarted,
  TnsOAuthPageLoadFinished
} from "./index";
import {
  ITnsOAuthLoginController,
  TnsOAuthLoginSubController
} from "./tns-oauth-login-sub-controller";

// https://developer.android.com/reference/android/view/WindowManager.LayoutParams#soft_input_adjust_resize
const SOFT_INPUT_ADJUST_RESIZE = 16;

export class TnsOAuthLoginWebViewController
  implements ITnsOAuthLoginController {
  private loginController: TnsOAuthLoginSubController = null;
  private unbindCancelEvent: () => void;

  public static initWithClient(client: TnsOAuthClient) {
    const instance = new TnsOAuthLoginWebViewController();
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
    this.goToWebViewPage(frame, fullUrl);
  }

  private goToWebViewPage(frame: Frame, url: string) {
    frame.navigate(() => this.createWebViewPage(url));
  }

  private createWebViewPage(url: string): Page {
    const webView = this.createWebView(
      url,
      this.pageLoadStarted.bind(this),
      this.pageLoadFinished.bind(this)
    );
    const grid = new GridLayout();
    grid.addChild(webView);

    const page = new Page();
    page.content = grid;

    if (isAndroid) {
      page.actionBarHidden = true;
      page.on("navigatedTo", () => {
        this.setAndroidSoftInputModeToResize();
        webView.android.getSettings().setDomStorageEnabled(true);
        webView.android.getSettings().setBuiltInZoomControls(false);
      });
      page.on("navigatingFrom", () => {
        this.restoreAndroidSoftInputMode();
      });
    } else {
      const navBtn = new NavigationButton();
      navBtn.text = "";
      page.actionBar.navigationButton = navBtn;
    }

    const onCancel = () => {
      this.loginController.completeLoginWithTokenResponseError(null, new Error("User cancelled."));
    };
    page.on("navigatedFrom", onCancel);
    this.unbindCancelEvent = () => page.off("navigatedFrom", onCancel);

    return page;
  }

  private createWebView(
    url: string,
    loadStarted: TnsOAuthPageLoadStarted,
    loadFinished: TnsOAuthPageLoadFinished
  ): WebView {
    const webView = new WebView();
    webView.on("loadStarted", loadStarted);
    webView.on("loadFinished", loadFinished);
    webView.src = url;
    return webView;
  }

  public resumeWithUrl(url: string): boolean {
    return this.loginController.resumeWithUrl(
      url,
      (tokenResult: ITnsOAuthTokenResult, error) => {
        this.loginController.completeLoginWithTokenResponseError(
          tokenResult,
          error
        );
        if (this.unbindCancelEvent) {
          this.unbindCancelEvent();
        }
        this.loginController.frame.goBack();
      }
    );
  }

  private pageLoadStarted(args: LoadEventData) {
    console.log("WebView loadStarted " + args.url);
    if (
      args.url.startsWith(
        this.loginController.client.provider.options.redirectUri
      )
    ) {
      if (isAndroid && args.object && args.object.stopLoading) {
        args.object.stopLoading();
      }
      this.resumeWithUrl(args.url);
    }
  }
  private pageLoadFinished(args: LoadEventData) {
    console.log("WebView loadFinished " + args.url);
  }

  private originalSoftInputMode: number;

  private setAndroidSoftInputModeToResize(): void {
    const window = androidApp.foregroundActivity.getWindow();
    this.originalSoftInputMode = window.getAttributes().softInputMode;
    window.setSoftInputMode(SOFT_INPUT_ADJUST_RESIZE);
  }

  private restoreAndroidSoftInputMode(): void {
    const window = androidApp.foregroundActivity.getWindow();
    window.setSoftInputMode(this.originalSoftInputMode);
  }
}
