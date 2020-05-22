import { TnsOAuthClient } from "../index";
export declare class TnsOAuthClientAppDelegate {
    private static _client;
    private static _urlScheme;
    static setConfig(client: TnsOAuthClient, urlScheme: string): void;
    private static getAppDelegate;
    private static addAppDelegateMethods;
    static doRegisterDelegates(): void;
    private static handleIncomingUrl;
}
