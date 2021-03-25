import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { Routes } from "@angular/router";
import { AuthenticatedComponent } from "./authenticated/authenticated.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "authenticated", component: AuthenticatedComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
