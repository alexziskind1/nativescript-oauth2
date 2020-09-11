import { TnsOAuthClient } from "../index";

function setup() {
  @ObjCClass(UIApplicationDelegate)
  @NativeClass()
  class TnsOAuthClientAppDelegate
    extends UIResponder
    implements UIApplicationDelegate {
    private static _client: TnsOAuthClient;
    private static _urlScheme: string;

    public static setConfig(client: TnsOAuthClient, urlScheme: string) {
      this._client = client;
      this._urlScheme = urlScheme;
    }

    // iOS >= 10
    public applicationOpenURLOptions(
      application: UIApplication,
      url: NSURL,
      options: NSDictionary<string, any>
    ): boolean {
      return this.handleIncomingUrl(url);
    }

    // iOS < 10
    public applicationOpenURLSourceApplicationAnnotation?(
      application: UIApplication,
      url: NSURL,
      sourceApplication: string,
      annotation: any
    ): boolean {
      return this.handleIncomingUrl(url);
    }

    private handleIncomingUrl(url: NSURL): boolean {
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
  return TnsOAuthClientAppDelegate;
}

export const TnsOAuthClientAppDelegate = setup();
