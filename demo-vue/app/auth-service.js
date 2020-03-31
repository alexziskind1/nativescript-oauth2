"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_oauth2_1 = require("@essent/nativescript-oauth2");
var providers_1 = require("@essent/nativescript-oauth2/providers");
var client = null;
function configureOAuthProviders() {
    var microsoftProvider = configureOAuthProviderMicrosoft();
    var googleProvider = configureOAuthProviderGoogle();
    var facebookProvider = configureOAuthProviderFacebook();
    nativescript_oauth2_1.configureTnsOAuth([microsoftProvider, googleProvider, facebookProvider]);
}
exports.configureOAuthProviders = configureOAuthProviders;
function configureOAuthProviderGoogle() {
    var googleProviderOptions = {
        openIdSupport: "oid-full",
        clientId: "932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb.apps.googleusercontent.com",
        redirectUri: "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb:/auth",
        urlScheme: "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb",
        scopes: ["email"]
    };
    var googleProvider = new providers_1.TnsOaProviderGoogle(googleProviderOptions);
    return googleProvider;
}
function configureOAuthProviderFacebook() {
    var facebookProviderOptions = {
        openIdSupport: "oid-none",
        clientId: "691208554415645",
        clientSecret: "d8725ac416fa1bb1917ccffd1670e3c6",
        redirectUri: "https://www.facebook.com/connect/login_success.html",
        scopes: ["email"]
    };
    var facebookProvider = new providers_1.TnsOaProviderFacebook(facebookProviderOptions);
    return facebookProvider;
}
function configureOAuthProviderMicrosoft() {
    var microsoftProviderOptions = {
        openIdSupport: "oid-full",
        clientId: "f376fa87-64a9-49a1-8b56-e0d48fc0810b",
        // redirectUri: "urn:ietf:wg:oauth:2.0:oob",
        redirectUri: "msalf376fa87-64a9-49a1-8b56-e0d48fc0810b://auth",
        urlScheme: "msalf376fa87-64a9-49a1-8b56-e0d48fc0810b",
        scopes: ["https://outlook.office.com/mail.read"]
    };
    var microsoftProvider = new providers_1.TnsOaProviderMicrosoft(microsoftProviderOptions);
    return microsoftProvider;
}
function tnsOauthLogin(providerType) {
    client = new nativescript_oauth2_1.TnsOAuthClient(providerType);
    client.loginWithCompletion(function (tokenResult, error) {
        if (error) {
            console.error("back to main page with error: ");
            console.error(error);
        }
        else {
            console.log("back to main page with access token: ");
            console.log(tokenResult);
        }
    });
}
exports.tnsOauthLogin = tnsOauthLogin;
function tnsOauthLogout() {
    if (client) {
        client.logout();
    }
}
exports.tnsOauthLogout = tnsOauthLogout;
