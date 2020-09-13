import { Component } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";
import { Page } from "@nativescript/core";
import { AuthService } from "../auth.service";

@Component({
    selector: "ns-login",
    moduleId: module.id,
    templateUrl: "login.component.html",
})
export class LoginComponent {
    constructor(
        private authService: AuthService,
        private routerExtensions: RouterExtensions
    ) {}

    public onTapLogin() {
        this.authService
            .tnsOauthLogin("microsoft")
            .then((result: ITnsOAuthTokenResult) => {
                console.log(
                    "back to login component with token " + result.accessToken
                );
                this.routerExtensions
                    .navigate(["../authenticated"])
                    .then(() => console.log("navigated to /authenticated"))
                    .catch((err) =>
                        console.log(
                            "error navigating to /authenticated: " + err
                        )
                    );
            })
            .catch((e) => console.log("Error: " + e));
    }
}
