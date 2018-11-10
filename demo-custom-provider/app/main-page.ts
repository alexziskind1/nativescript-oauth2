import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { HelloWorldModel } from "./main-view-model";
import { tnsOauthLogin, tnsOauthLogout } from "./auth-service";

let page: Page;

export function navigatingTo(args: EventData) {
    page = <Page>args.object;
    page.bindingContext = new HelloWorldModel();
}

export function onLoginTap() {
    tnsOauthLogin("myCustomProvider");
}

export function onLogoutTap() {
    tnsOauthLogout();
}
