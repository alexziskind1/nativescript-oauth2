import * as applicationModule from "tns-core-modules/application";
import * as platformModule from "tns-core-modules/platform";
import * as dialogs from "tns-core-modules/ui/dialogs";
// import { tnsOauthProviderMap } from "./tns-oauth-helper-setup";
import { TnsOAuthClientLoginBlock } from "./index";
import { TnsOaProvider, TnsOaProviderType } from "./providers";

export class TnsOAuthClient {
  public provider: TnsOaProvider = null;

  public constructor(providerType: TnsOaProviderType) {
    this.provider = tnsOauthProviderMap.providerMap.get(providerType);
    if (this.provider) {
      console.log("provider found");
    } else {
      console.log("provider NOT found");
    }
  }
  public loginWithCompletion(completion?: TnsOAuthClientLoginBlock): void {}
}

export class Common {
  public message: string;

  constructor() {
    this.message = Utils.SUCCESS_MSG();
  }

  public greet() {
    return "Hello, NS";
  }

  public sayHello(name: string): string {
    return "Say hello " + name;
  }
}

export class Utils {
  public static SUCCESS_MSG(): string {
    let msg = `Your plugin is working on ${
      applicationModule.android ? "Android" : "iOS"
    }.`;

    setTimeout(() => {
      dialogs
        .alert(`${msg} For real. It's really working :)`)
        .then(() => console.log(`Dialog closed.`));
    }, 2000);

    return msg;
  }
}

export class TnsOauthProviderMap {
  public providerMap: Map<TnsOaProviderType, TnsOaProvider>;

  constructor() {
    this.providerMap = new Map();
  }

  public addProvider(providerType: TnsOaProviderType, provider: TnsOaProvider) {
    this.providerMap.set(providerType, provider);
  }
}

export const tnsOauthProviderMap = new TnsOauthProviderMap();

function configureClientAuthAppDelegate(): void {
  // application.ios.delegate = TnsOAuthClientAppDelegate;
}

export function configureTnsOAuth(providers: TnsOaProvider[]) {
  if (platformModule.isIOS) {
    // if (providers.some(p => p.options.openIdSupport === "oid-full")) {
    //  configureClientAuthAppDelegate();
    // }
  }

  for (let i = 0; i < providers.length; ++i) {
    tnsOauthProviderMap.addProvider(providers[i].providerType, providers[i]);
  }
}
