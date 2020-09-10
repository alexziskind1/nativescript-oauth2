import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
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
