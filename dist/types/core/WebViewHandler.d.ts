/**
 * WebViewHandler: Handles WebView-specific close events and communication.
 */
export declare class WebViewHandler {
    private readonly url;
    private data;
    private appMessage;
    constructor(url: string, data: object, appMessage: string);
    /**
     * Starts handling WebView close events.
     */
    startWithBeacon(): void;
    startWithFetch(): void;
    /**
     * Sends a message to the native app via WebBridge.
     */
    private setupWebBridge;
}
