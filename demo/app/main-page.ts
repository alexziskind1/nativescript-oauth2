import { Page, EventData } from "@nativescript/core";
import { HelloWorldModel } from "./main-view-model";
import {
  tnsOauthLogin,
  tnsOauthLogout,
  tnsRefreshOAuthAccessToken,
} from "./auth-service";

let page: Page;

export function navigatingTo(args: EventData) {
  page = <Page>args.object;
  page.bindingContext = new HelloWorldModel();
}

export function onLoginTap() {
  tnsOauthLogin("microsoft");
}

export function onRefreshTokenTap() {
  tnsRefreshOAuthAccessToken();
}

export function onLogoutTap() {
  tnsOauthLogout();
}
