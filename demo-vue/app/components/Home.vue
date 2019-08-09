<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="OAuth Demo: NativeScript-Vue"></Label>
        </ActionBar>

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

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .fa {
        color: $accent-dark;
    }

    .info {
        font-size: 20;
    }
</style>
