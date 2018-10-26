import * as application from "tns-core-modules/application";
import { configureOAuthProviders } from "./auth-service";

configureOAuthProviders();

application.start({ moduleName: "main-page" });
