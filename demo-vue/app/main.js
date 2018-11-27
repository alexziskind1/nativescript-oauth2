import Vue from 'nativescript-vue';
import App from './components/App';
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

var auth_service_1 = require("./auth-service");
auth_service_1.configureOAuthProviders();


new Vue({
  render: h => h('frame', [h(App)])
}).$start()
