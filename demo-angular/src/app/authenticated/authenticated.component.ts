import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { Page } from "tns-core-modules/ui/page";
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
    this.authService.tnsOauthLogout()
    .then(() => {
      this.routerExtensions.back();
    })
    .catch(e => console.log("Error: " + e));
    
  }
}