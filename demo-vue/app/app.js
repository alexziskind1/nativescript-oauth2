import Vue from "nativescript-vue";

import Home from "./components/Home";

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

var auth_service_1 = require("./auth-service");
auth_service_1.configureOAuthProviders();

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    }
}).$start();
