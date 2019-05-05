import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { Page } from "ui/page";
import { AuthService } from "../auth.service";

@Component({
  selector: "ns-authenticated",
  moduleId: module.id,
  templateUrl: "authenticated.component.html"
})
export class AuthenticatedComponent {
  constructor(private authService: AuthService, private page: Page, private routerExtensions: RouterExtensions) {
    page.actionBarHidden = true;
  }

  public onTapLogout() {
    this.authService.tnsOauthLogout();
    this.routerExtensions.back();
  }
}