<template>
    <Page>
        <ActionBar title="OAuth Demo: NativeScript-Vue"/>
        <StackLayout class="p-20">
            <Button text="Login" @tap="onLoginTap()" class="btn btn-primary btn-active"/>
            <Button text="Logout" @tap="onLogoutTap()" class="btn btn-primary btn-active"/>
        </StackLayout>
    </Page>
</template>

<script>
    var auth_service_1 = require("../auth-service");


  export default {
    data() {
      return {}
    },
    methods: {
        onLoginTap() {
            auth_service_1.tnsOauthLogin("facebook");
        },
        onLogoutTap() {
            auth_service_1.tnsOauthLogout();
        }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
