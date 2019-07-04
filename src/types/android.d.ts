declare namespace android {
  export namespace support {
    export namespace customtabs {
      export class CustomTabsIntent {
        launchUrl(context: android.content.Context, url: android.net.Uri): void;
      }
      namespace CustomTabsIntent {
        export class Builder {
          constructor();
          constructor(session: CustomTabsSession);
          build(): android.support.customtabs.CustomTabsIntent;
          setShowTitle(showTitle: boolean): this;
          setToolbarColor(color: number): this;
          addDefaultShareMenuItem(): this;
          enableUrlBarHiding(): this;
        }
      }

      interface ICustomTabsServiceConnection {
        onCustomTabsServiceConnected(
          name: android.content.ComponentName,
          client: CustomTabsClient
        ): void;
        onServiceDisconnected(name: android.content.ComponentName): void;
      }

      export class CustomTabsServiceConnection {
        constructor();
        static extend<T extends typeof CustomTabsServiceConnection>(
          implementation: ICustomTabsServiceConnection
        ): T;
      }

      export class CustomTabsSession { }

      export class CustomTabsClient {
        warmup(flags: number): boolean;
        newSession(callback: any): CustomTabsSession;

        static bindCustomTabsService(
          context: android.content.Context,
          packageName: String,
          connection: CustomTabsServiceConnection
        ): boolean;
      }
    }
  }
}

declare namespace androidx {
  export namespace browser {
    export namespace customtabs {
      export class CustomTabsIntent {
        launchUrl(context: android.content.Context, url: android.net.Uri): void;
      }
      namespace CustomTabsIntent {
        export class Builder {
          constructor();
          constructor(session: CustomTabsSession);
          build(): androidx.browser.customtabs.CustomTabsIntent;
          setShowTitle(showTitle: boolean): this;
          setToolbarColor(color: number): this;
          addDefaultShareMenuItem(): this;
          enableUrlBarHiding(): this;
        }
      }

      interface ICustomTabsServiceConnection {
        onCustomTabsServiceConnected(
          name: android.content.ComponentName,
          client: CustomTabsClient
        ): void;
        onServiceDisconnected(name: android.content.ComponentName): void;
      }

      export class CustomTabsServiceConnection {
        constructor();
        static extend<T extends typeof CustomTabsServiceConnection>(
          implementation: ICustomTabsServiceConnection
        ): T;
      }

      export class CustomTabsSession { }

      export class CustomTabsClient {
        warmup(flags: number): boolean;
        newSession(callback: any): CustomTabsSession;

        static bindCustomTabsService(
          context: android.content.Context,
          packageName: String,
          connection: CustomTabsServiceConnection
        ): boolean;
      }
    }
  }
}
