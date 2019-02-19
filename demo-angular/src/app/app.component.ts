import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";
import { Page } from "tns-core-modules/ui/page/page";
import { topmost } from "tns-core-modules/ui/frame";

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent {
    constructor(private authService: AuthService, private page: Page) { }

    public onTapLogin() {
        const fram = topmost();

        this.authService
            .tnsOauthLogin("facebook")
            .then((result: ITnsOAuthTokenResult) => {
                console.log("back to app component with token" + result.accessToken);
            });
    }

    public onTapLogout() {
        this.authService.tnsOauthLogout();
    }
}
