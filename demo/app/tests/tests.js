var Oauth = require("nativescript-oauth").Oauth;
var oauth = new Oauth();

describe("greet function", function() {
    it("exists", function() {
        expect(oauth.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(oauth.greet()).toEqual("Hello, NS");
    });
});