import * as application from "tns-core-modules/application";
import { configureOAuthProviders } from "./auth-service";

configureOAuthProviders();

application.run({ moduleName: "app-root" });
