# OAuth 2 Plugin for NativeScript

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]: https://travis-ci.org/alexziskind1/nativescript-oauth2.svg?branch=master
[build-url]: https://travis-ci.org/alexziskind1/nativescript-oauth2
[npm-image]: http://img.shields.io/npm/v/nativescript-oauth2.svg
[npm-url]: https://npmjs.org/package/nativescript-oauth2
[downloads-image]: http://img.shields.io/npm/dm/nativescript-oauth2.svg
[twitter-image]: https://img.shields.io/twitter/follow/digitalix.svg?style=social&label=Follow%20me
[twitter-url]: https://twitter.com/digitalix

Library for interacting with OAuth 2.0 in NativeScript applications that provides simplified direct client access with a OAuth providers that support the OAuth 2.0 protocol such as Microsoft, Facebook, and Google, but not limited to any login providers, and even allows you to plug in your own. This library doesn't use any native libraries and relies only on what comes in the box - making it really lightweight.

**_NOTE:_** **This is the new version of the old [nativescript-oauth plugin](https://www.npmjs.com/package/nativescript-oauth)**

**_NOTE:_** For **NativeScript 7** support, use version 3+ of this plugin. For versions of NativeScript that are less than 7, use versions less than 3 of this plugin.

<img src="https://raw.githubusercontent.com/alexziskind1/nativescript-oauth2/master/docs/images/nativescript-oauth2-logo.png" alt="NativeScript OAuth 2"/>

<br/>

Tested against Microsoft, Facebook, and Google providers. More providers are coming soon.
Thanks to all those who contributed providers to the old plugin - please do the same for this one.

## Introduction

Some providers are [OpenId certified](https://openid.net/certification/) (Google, Microsoft) so they are a bit more secure in that they don't have to store the client secret on the client (which can always be pwned by folks that are savvy enough to get into your app). Google doesn't allow client secrets to be passed and requires an out-of-app browser to be used for auth. This plugin supports this method for any providers that require it, but there are a few extra configuration steps that have to be performed to get this working, more on that below.

Facebook doesn't support OpenId and works with the in-app WebView implementation of the auth process. So while this requires less configuration, there is an slight security risk of keeping your client secret in the app. If you have strict security requirements, you have to implement Facebook login by using your backend as a proxy between this plugin and Facebook auth servers.

## Prerequisites

### Office 365 / Microsoft

For logging in with your Office 365 account, you should have an Office 365 Account admin account. If you don't have one yet, you can get a [free trial here](https://products.office.com/en-us/try).

Keep an eye out on my [YouTube channel](https://www.youtube.com/c/AlexanderZiskind) for a video on how to set up Facebook with with plugin.

Register your mobile app [here](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade). 

Microsoft login will work either with the in-app webview method, in which case your redirectUri config property can be set to `urn:ietf:wg:oauth:2.0:oob`. Or it can use the more secure method that doesn't require a client secret, but it will need to have a custom URL scheme registered (see below).

### Facebook account

For logging in with your Facebook account, you should have a Facebook developer account. If you don't have one yet, you can get one [here](https://developers.facebook.com/).

Keep an eye out on my [YouTube channel](https://www.youtube.com/c/AlexanderZiskind) for a video on how to set up Facebook with with plugin.

Register your mobile app by following the wizard under "My Apps" -> "Add a new app".

1.  Go to https://developers.facebook.com/apps and create a new app
2.  If you see the Product Setup page, select Facebook login
3.  Make sure to turn ON the option "Embedded Browser OAuth Login"
4.  Click Save
5.  Copy the App ID and the App Secret from the Dashboard page to bootstrap your app. These will be the ClientID and ClientSecret respectively.

### Google account

For logging in with your Google account, you should have a Google developer account. If you don't have one yet, you can get one [here](https://developers.google.com/).

Keep an eye out on my [YouTube channel](https://www.youtube.com/c/AlexanderZiskind) for a video on how to set up Google with this plugin.

Register your mobile app by following the wizard in the Developer Console.
(more info coming soon)

Google login will only work with the out-of-app browser. You must register a custom URL scheme for your app (see below).

### LinkedIn Account

For logging in with your LinkedIn account, you should have a LinkedIn developer account. If you don't have one yet, you can get one [here](https://developer.linkedin.com/).

1.  Click on `My Apps` and login with your LinkedIn credentials or click on Join Now to create a new account.
2.  Once logged in click on `Create Application`.
3.  Fill out all fields with the app's information and Click `submit`.
4.  If everything goes well you should get your app's authentication keys which consists of a client id and a client secret.
5.  In this page, make sure to add an `Authorized Redirect URL`. (This can be any url starting with http:// or https://).
6.  Copy the Authentication Keys and the Authorized Redirect URL.

### IdentityServer Account

For logging in with [IdentityServer](https://identityserver.io/) you can make use of the [demo server](https://demo.identityserver.io/) or create your own. You can get more information on how to start your own IdentityServer [here](https://identityserver4.readthedocs.io/en/latest/quickstarts/0_overview.html).

The default IdentityServer provider is configured to use the [demo server](https://demo.identityserver.io/) with **client id: native.code** _grant type: authorization code with PKCE and client credentials_.

login with `bob/bob`, `alice/alice` or choose external login with `Google` or `Azure AD`.

## Setup

Add TypeScript to your NativeScript project if you don't already have it added. While this is not a requirement, it's highly recommended. If you want to watch a video on how to convert your existing JavaScript based NativeScript app to TypeScript, [watch it here](https://youtu.be/2JDXnduTlgs).

From the command prompt go to your app's root folder and execute:

```
npm install nativescript-oauth2 --save
```

## Usage

If you want a quickstart, you can start with one of two demo apps:

- [TypeScript Demo App](https://github.com/alexziskind1/nativescript-oauth2/tree/master/demo)
- [Angular Demo App](https://github.com/alexziskind1/nativescript-oauth2/tree/master/demo-angular)
- [Vue Demo App](https://github.com/alexziskind1/nativescript-oauth2/tree/master/demo-vue)

### Bootstrapping

When your app starts up, you'll have to register one or more auth providers to use with the nativescript-oauth2 plugin. You'll use the code below to register the providers.

#### NativeScript Core

If you are using NativeScript Core, open `app.ts` and add the following registration code before `application.start();`

#### NativeScript with Angular

If you are using Angular AND you are NOT using `<page-router-outlet`, you'll need to enable frames in order for the plugin to open up a new native page with a login screen. To do that open your `main.ts` file. You will need to explicitly use frames, so make sure to pass an options object to `platformNativeScriptDynamic` with the `createFrameOnBootstrap` flag set to `true`, like this.

```typescript
// main.ts
platformNativeScriptDynamic({ createFrameOnBootstrap: true }).bootstrapModule(
  AppModule
);
```

You don't need to do this if you already have `<page-router-outlet>` in your component.

then add add the registration code below somewhere before you call login, most likely in your Auth service, as in the demo-angular project.

#### NativeScript-Vue

If you are using NativeScript-Vue, then you'll have to add this registration code somewhere when your app bootstraps. A Vue demo app is included with the GitHub repo.

```typescript
// This is the provider registration example code

import { configureTnsOAuth } from "nativescript-oauth2";

import {
  TnsOaProvider,
  TnsOaProviderOptionsFacebook,
  TnsOaProviderFacebook,
  TnsOaProviderOptionsGoogle,
  TnsOaProviderGoogle,
  TnsOaProviderOptionsMicrosoft,
  TnsOaProviderMicrosoft,
} from "nativescript-oauth2/providers";

function configureOAuthProviderGoogle(): TnsOaProvider {
  const googleProviderOptions: TnsOaProviderOptionsGoogle = {
    openIdSupport: "oid-full",
    clientId:
      "932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb.apps.googleusercontent.com",
    redirectUri:
      "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb:/auth",
    urlScheme:
      "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb",
    scopes: ["email"],
  };
  const googleProvider = new TnsOaProviderGoogle(googleProviderOptions);
  return googleProvider;
}

function configureOAuthProviderFacebook(): TnsOaProvider {
  const facebookProviderOptions: TnsOaProviderOptionsFacebook = {
    openIdSupport: "oid-none",
    clientId: "691208554415641",
    clientSecret: "d8725ac416fa1bb1917ccffd1670e3c7",
    redirectUri: "https://www.facebook.com/connect/login_success.html",
    scopes: ["email"],
  };
  const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
  return facebookProvider;
}

configureTnsOAuth([
  configureOAuthProviderGoogle(),
  configureOAuthProviderFacebook(),
]);
```

The plugin comes with helpful interfaces that you can implement for the providers as well as the options that can be passed into each provider's constructor. You don't have to use these interfaces, but they are helpful guides. The code above shows these interfaces.

The last call to `configureTnsOAuth()` takes an array of providers and registers them as available for use.

### Logging in

When you're ready to login, or as a response to a tap event on a login button, you can create a new instance of the `TnsOAuthClient` and call `loginWithCompletion()` on the instance, passing in the provider you want to login with. The provider is of the type `TnsOaProviderType`, or it can be a string 'google', 'facebook', 'microsoft', etc.

By default, this plugin enables [PKCE (Proof Key for Code Exchange)](https://oauth.net/2/pkce/) since version 2.0.0.
If you want to disable it, pass in `false` as the second argument of the `TnsOAuthClient` constructor.

```typescript
import { TnsOAuthClient, ITnsOAuthTokenResult } from "nativescript-oauth2";

const client = new TnsOAuthClient(providerType);

client.loginWithCompletion((tokenResult: ITnsOAuthTokenResult, error) => {
  if (error) {
    console.error("back to main page with error: ");
    console.error(error);
  } else {
    console.log("back to main page with access token: ");
    console.log(tokenResult);
  }
});
```

After login is done, the completion handler will be called with the results.

### Refreshing the Access Token

Once you have logged in, you can call `refreshTokenWithCompletion()` on your `TnsOAuthClient` instance to attempt to refresh your access token. In order to do this, the following criteria must be met:

- The scope `offline_access` was requested when you logged in.
- The `TnsOAuthClient` must have the token result from your previous login. If you have the original instance you used to log in, it will already be on the object. If you do not have the original instance of `TnsOAuthClient` which you used to log in, such as if the app was restarted, then assign the client's `tokenResult` property to your token.

If that criteria is met, then you can refresh the token like so:

```
import { TnsOAuthClient, ITnsOAuthTokenResult } from "nativescript-oauth2";

...

client.refreshTokenWithCompletion((tokenResult: ITnsOAuthTokenResult, error) => {
  if (error) {
    console.error("Unable to refresh token with error: ");
    console.error(error);
  } else {
    console.log("Successfully refreshed access token: ");
    console.log(tokenResult);
  }
});
```

### Creating a custom provider

If you don't see an auth provider that you need, you can just implement your own - see the `demo-custom-provider` project in the GitHub repo for an example on how to do this.

You need to implement two interfaces: provider options that suits your provider (more below), and `TnsOaProvider` for the provider endpoint details.

#### Provider Options

Implement your provider's options by extending the `TnsOaUnsafeProviderOptions` interface **if your provider is not Open Id compliant**, or the `TnsOaOpenIdProviderOptions` interface **if your provider _is_ Open Id compliant**.

> Note: the interface is named with the word 'unsafe' in the name because non-open id compliant providers (like Facebook) usually make you use a client secret to send to the provider in exchange for the token. Storing the secret somewhere other than the client app is recommended (like a proxy), but most people don't do this and just store the secret with the app - thus unsafe.

```typescript
//Provider options example

export interface TnsOaMyCustomProviderOptions
  extends TnsOaUnsafeProviderOptions {}
```

#### TnsOaProvider

Then you can create your provider class by implementing the `TnsOaProvider` interface:

```typescript
//Provider implementation example

export class TnsOaProviderMyCustomProvider implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportNone = "oid-none";
  public providerType = "myCustomProvider";
  public authority = "https://www.facebook.com/v3.1/dialog";
  public tokenEndpointBase = "https://graph.facebook.com";
  public authorizeEndpoint = "/oauth";
  public tokenEndpoint = "/v3.1/oauth/access_token";
  public cookieDomains = ["facebook.com"];

  constructor(options: TnsOaMyCustomProviderOptions) {
    this.options = options;
  }

  public parseTokenResult(jsonData): ITnsOAuthTokenResult {
    return jsonData;
  }
}
```

Finally, you'll use your provider when you register it with the app.

```typescript
// app.ts

import * as application from "tns-core-modules/application";
import { configureOAuthProviders } from "./auth-service";
configureOAuthProviders();
application.run({ moduleName: "app-root" });
```

```typescript
// auth-service.ts

export function configureOAuthProviders() {
  const myCustomProvider = configureOAuthProviderMyCustomProvider();
  configureTnsOAuth([myCustomProvider]);
}
function configureOAuthProviderMyCustomProvider(): TnsOaProvider {
  const facebookProviderOptions: TnsOaMyCustomProviderOptions = {
    openIdSupport: "oid-none",
    clientId: "<your client/app id>",
    clientSecret: "<your client secret>",
    redirectUri: "<redirect Uri>",
    scopes: ["email"],
    customQueryParams: {
      foo: "bar",
    },
  };
  const facebookProvider = new TnsOaProviderMyCustomProvider(
    facebookProviderOptions
  );
  return facebookProvider;
}
```

### Custom URL Scheme

If you are using an OpenId certified provider and need to use an out-of-app browser to authenticate, then you must register a custom URL scheme with your app.
This is easy to do with NativeScript. The first step is to register your custom scheme with your provider when you register your app.

#### Android

To register a custom URL scheme for Android, open your Android app resources, which are in this path: app/App_Resources/Android/src/main/AndroidManifest.xml.
The AndroidManifest.xml file used to be right in the Android folder, but now it's been moved down a bit. It's still the same file though.

Find the `<activity>` section named `com.tns.NativeScriptActivity` and add the attribute `android:launchMode="singleTask"` (or `singleTop`).
Then inside the activity add a new `<intent-filter>` section with your custom url scheme(s).

Here is an example of the entire `<activity>` section:

```xml
		<activity android:name="com.tns.NativeScriptActivity" android:launchMode="singleTask" android:label="@string/title_activity_kimera" android:configChanges="keyboardHidden|orientation|screenSize" android:theme="@style/LaunchScreenTheme">

			<meta-data android:name="SET_THEME_ON_LAUNCH" android:resource="@style/AppTheme" />

			<intent-filter>
				<action android:name="android.intent.action.MAIN" />
				<category android:name="android.intent.category.LAUNCHER" />
			</intent-filter>

			<intent-filter>
				<action android:name="android.intent.action.VIEW"/>
				<category android:name="android.intent.category.DEFAULT" />
				<category android:name="android.intent.category.BROWSABLE" />
				<!-- Custom URL Schemes -->
				<data android:scheme="com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb"/>
				<data android:scheme="msalf376fa87-64a9-89a1-8b56-e0d48fc08107"/>
			</intent-filter>

		</activity>
```

Notice in the config above, I've registered TWO custom URL schemes for my app - this is the `<data>` element with the `path` and `scheme` attributes.

#### iOS

To register a custom URL scheme for iOS, open your iOS app resources, which are in this path: app/App_Resources/iOS/Info.plist. In the key/value dictionary in this file, add a key for `CFBundleURLTypes`, if it's not already there. And add the value for that key as an array. The entire addition is listed here:

```
	<key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleTypeRole</key>
			<string>Editor</string>
			<key>CFBundleURLName</key>
			<string>org.nativescript.testnsazmobaplugin</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>msalf376fa87-64a9-49a1-8b57-e0d48fc08107</string>
				<string>fb691208554415647</string>
				<string>com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb</string>
			</array>
		</dict>
	</array>
```

Notice that for the key `CFBundleURLSchemes`, there are three string listed as custom URL schemes, all of them will open your app.

## Contributing

1. Follow the [plugin authoring guidelines](https://docs.nativescript.org/plugins/building-plugins) in the NativeScript docs.
1. Use the Pull Request Template that can be found here to submit the PR.

## Contributing Quick Steps

1. Clone the repo: `https://github.com/alexziskind1/nativescript-oauth2.git`
1. Open a terminal and navigate to `/src` folder
1. Run `npm run build`, then run `npm run plugin.tscwatch`
1. Open another terminal in the `/src` folder
1. Run the Angular demo on iOS by executing the command `npm run demo.ios-angular`. For other demos on other platforms, see the different scripts available in the `package.json` file ion the `src` folder ([package.json file](https://github.com/alexziskind1/nativescript-oauth2/blob/master/src/package.json))
