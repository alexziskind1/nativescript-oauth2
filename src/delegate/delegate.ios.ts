import { TnsOAuthClient } from "../index";
import * as applicationModule from "tns-core-modules/application";
import * as platformModule from "tns-core-modules/platform";

export class TnsOAuthClientAppDelegate {
  private static _client: TnsOAuthClient;
  private static _urlScheme: string;

  public static setConfig(client: TnsOAuthClient, urlScheme: string) {
    this._client = client;
    this._urlScheme = urlScheme;
  }

  private static getAppDelegate() {
    // Play nice with other plugins by not completely ignoring anything already added to the appdelegate
    if (applicationModule.ios.delegate === undefined) {
      @ObjCClass(UIApplicationDelegate)
      class UIApplicationDelegateImpl extends UIResponder implements UIApplicationDelegate { }

      applicationModule.ios.delegate = UIApplicationDelegateImpl;
    }
    return applicationModule.ios.delegate;
  }

  private static addAppDelegateMethods = appDelegate => {
    if (parseInt(platformModule.device.osVersion.split('.')[0]) >= 10 ) {
      // iOS >= 10
      appDelegate.prototype.applicationOpenURLOptions = (
            application: UIApplication,
            url: NSURL,
            options: NSDictionary<string, any>) => {
        TnsOAuthClientAppDelegate.handleIncomingUrl(url);
      };
    } else {
      // iOS < 10
      appDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = (
            application: UIApplication,
            url: NSURL,
            sourceApplication: string,
            annotation: any ) => {
        TnsOAuthClientAppDelegate.handleIncomingUrl(url);
      };
    }
  }

  public static doRegisterDelegates() {
    this.addAppDelegateMethods(this.getAppDelegate());
  }

  private static handleIncomingUrl(url: NSURL): boolean {
    if (
      !TnsOAuthClientAppDelegate._client ||
      !TnsOAuthClientAppDelegate._urlScheme
    ) {
      // the delegate wasn't wired to the client, that should have resulted in an errormessage already
      console.log("IMPORTANT: Could not complete login flow.");
      return false;
    }

    if (url.scheme.toLowerCase() === TnsOAuthClientAppDelegate._urlScheme) {
      TnsOAuthClientAppDelegate._client.resumeWithUrl(url.absoluteString);
      return true;
    } else {
      return false;
    }
  }
}
