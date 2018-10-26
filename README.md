# OAuth 2 Plugin for NativeScript

Library for interacting with OAuth 2.0 in NativeScript applications that provides simplified direct client access with a OAuth providers that support the OAuth 2.0 protocol such as Microsoft, Facebook, and Google.

**_NEW:_** **This is the new version of the old [nativescript-oauth plugin](https://www.npmjs.com/package/nativescript-oauth)**

<img src="https://raw.githubusercontent.com/alexziskind1/nativescript-oauth2/master/docs/images/nativescript-oauth2-logo.png" alt="NativeScript OAuth 2"/>
<br/>

Tested against Microsoft, Facebook, and Google providers. More providers are coming soon.
Thanks to all those who contributed providers to the old plugin - please do the same for this one.

## Introduction

Some providers are [OpenId certified](https://openid.net/certification/) (Google, Microsoft) so they are a bit more secure in that they don't have to store the client secret on the client (which can always be pwned by folks that are savvy enough to get into your app). Google doesn't allow client secrets to be passed and requires an out-of-app browser to be used for auth. This plugin supports this method for any providers that require it, but there are a few extra configuration steps that have to be performed to get this working, more on that below.

Facebook doesn't support OpenId and works with the in-app webview implementation of the auth process. So while this requires less configuration, there is an slight security risk of keeping your client secret in the app. If you have strict security requirements, you have to implement Facebook login by using your backend as a proxy between this plugin and Facebook auth servers.

## Prerequisites

### Office 365 / Microsoft

For logging in with your Office 365 account, you should have an Office 365 Account admin account. If you don't have one yet, you can get a [free trial here](https://products.office.com/en-us/try).

Keep an eye out on my [YouTube channel](https://www.youtube.com/c/AlexanderZiskind) for a video on how to set up Facebook with with plugin.

Register your mobile app [here](https://apps.dev.microsoft.com). This will require you to login with your Office 365 account. You can then click the big "Add an app" button and go through the steps listed there, starting with giving you app a name. On the app creation screen, you need to do 3 things:

1.  Click the "Add Platform" button and select "Mobile application"
2.  Copy the "Client Id" GUID from the Mobile Application section.
3.  Click "Save" at the bottom.

### Facebook account

For logging in with your Facebook account, you should have a Facebook developer account. If you don't have one yet, you can get one [here](https://developers.facebook.com/).

Keep an eye out on my [YouTube channel](https://www.youtube.com/c/AlexanderZiskind) for a video on how to set up Facebook with with plugin.

Register your mobile app by following the wizard under "My Apps" -> "Add a new app".

1.  Go to https://developers.facebook.com/apps and create a new app
2.  If you see the Product Setup page, select Facebook login
3.  Make sure to turn ON the option "Embedded Browser OAuth Login"
4.  Click Save
5.  Copy the App ID and the App Secret from the Dashboard page to bootstrap your app. These will be the ClientID and ClientSecret respectively.

### LinkedIn Account (coming soon)

For logging in with your LinkedIn account, you should have a LinkedIn developer account. If you don't have one yet, you can get one [here](https://developer.linkedin.com/).

1.  Click on `My Apps` and login with your LinkedIn credentials or click on Join Now to create a new account.
2.  Once logged in click on `Create Application`.
3.  Fill out all fields with the app's information and Click `submit`.
4.  If everything goes well you should get your app's authentication keys which consists of a client id and a client secret.
5.  In this page, make sure to add an `Authorized Redirect URL`. (This can be any url starting with http:// or https://).
6.  Copy the Authentication Keys and the Authorized Redirect URL.

## Setup

Add TypeScript to your NativeScript project if you don't already have it added. While this is not a requirement, it's highly recommended. If you want to watch a video on how to convert your existing JavaScript based NativeScript app to TypeScript, [watch it here](https://youtu.be/2JDXnduTlgs).

From the command prompt go to your app's root folder and execute:

```
npm install nativescript-oauth2 --save
```

## Usage

If you want a quickstart, you can start with one of two demo apps:

- [TypeScript Demo App](https://github.com/alexziskind1/nativescript-oauth2/tree/master/demo)
- [Angular Demo App (coming soon)](https://github.com/alexziskind1/nativescript-oauth2/tree/master/demo-angular)

### Bootstrapping

When your app starts up, you'll have to register one or more auth providers to use with the nativescript-oauth2 plugin. If you are not using Angular, open `app.ts` and add the following code before `application.start();`
If you are using Angular, then open your `main.ts` file and add the following code before `platformNativeScriptDynamic().bootstrapModule(AppModule);`

```typescript
import { configureTnsOAuth } from "nativescript-oauth2";

import {
  TnsOaProvider,
  TnsOaProviderOptionsFacebook,
  TnsOaProviderFacebook,
  TnsOaProviderOptionsGoogle,
  TnsOaProviderGoogle,
  TnsOaProviderOptionsMicrosoft,
  TnsOaProviderMicrosoft
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
    scopes: ["email"]
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
    scopes: ["email"]
  };
  const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
  return facebookProvider;
}

configureTnsOAuth([
  configureOAuthProviderGoogle(),
  configureOAuthProviderFacebook()
]);
```

The plugin comes with helpful interfaces that you can implement for the providers as well as the options that can be passed into each provider's constructor. You don't have to use these interfaces, but they are helpful guides. The code above shows these interfaces.

The last call to `configureTnsOAuth()` takes an array of providers and registers them as available for use.

### Logging in

When you're ready to login, or as a response to a tap event on a login button, you can create a new instance of the `TnsOAuthClient` and call `loginWithCompletion()` on the instance, passing in the provider you want to login with. The provider is of the type `TnsOaProviderType`, or it can be a string 'google', 'facebook', 'microsoft', etc.

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

### Creating a custom provider

If you don't see an auth provider that you need, you can just implement your own.

If your provider supports OpenId, simply implement your provider's options by extending the `TnsOaOpenIdProviderMyProvider` interface.

```typescript
export declare type ProviderTypeMyProvider = "myProvider";
export interface TnsOaProviderOptionsMyProvider
  extends TnsOaOpenIdProviderMyProvider {}
```

Then you can create your provider class by implementing the `TnsOaProvider` interface:

```typescript
export declare class TnsOaProviderMyProvider implements TnsOaProvider {
  options: TnsOaProviderOptions;
  openIdSupport: OpenIdSupportFull;
  providerType: ProviderTypeMyProvider;
  authority: string;
  tokenEndpointBase: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  cookieDomains: string[];
  constructor(options: TnsOaProviderOptionsMyProvider);
  parseTokenResult(jsonData: any): ITnsOAuthTokenResult;
}
```

## Contributing

1. Follow the [plugin authoring guidelines](https://docs.nativescript.org/plugins/building-plugins) in the NativeScript docs.
1. Use the Pull Request Template that can be found here to submit the PR.
