// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { configureOAuthProviders } from "./app/auth-providers-helper";

import { AppModule } from "./app/app.module";

configureOAuthProviders();

platformNativeScriptDynamic().bootstrapModule(AppModule);
