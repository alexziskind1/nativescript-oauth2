import { TnsOAuthClient } from "../index";
import * as applicationModule from "tns-core-modules/application";
// import * as platformModule from "tns-core-modules/platform";

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
      console.log("creating new delegate");
      @ObjCClass(UIApplicationDelegate)
      class UIApplicationDelegateImpl extends UIResponder implements UIApplicationDelegate {
      }
  
      applicationModule.ios.delegate = UIApplicationDelegateImpl;
    } else {
      console.log("returning existing delegate");
    }
    return applicationModule.ios.delegate;
  }
  
  private static addAppDelegateMethods = appDelegate => {
      console.log("fired: addAppDelegateMethods");
      
      appDelegate.prototype.applicationOpenURLOptions = (application: UIApplication, url: NSURL, options: NSDictionary<string, any>) => {
        console.log("fired: " + url);
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
      };
  }

  public static doRegisterDelegates() {
    this.addAppDelegateMethods(this.getAppDelegate());
  }

}
