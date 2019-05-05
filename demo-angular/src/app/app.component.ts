import { Component } from "@angular/core";
import { Page } from "ui/page";

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "app.component.html"
})
export class AppComponent {
    constructor(private page: Page) {
        page.actionBarHidden = true;
    }
}
