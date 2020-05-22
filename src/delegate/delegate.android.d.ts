import { TnsOAuthClient } from "../index";
export declare class TnsOAuthClientAppDelegate {
    static _client: TnsOAuthClient;
    private static _urlScheme;
    static setConfig(client: TnsOAuthClient, urlScheme: string): void;
    static doRegisterDelegates(): void;
}
