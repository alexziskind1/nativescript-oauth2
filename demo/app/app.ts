import { Application } from "@nativescript/core";

import { configureOAuthProviders } from "./auth-service";

configureOAuthProviders();

Application.run({ moduleName: "app-root" });
