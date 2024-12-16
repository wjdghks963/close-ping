/**
 * Configuration object for the ClosePing library.
 */
export type ClosePingConfig = {
    url: string;
    data: object;
    useBeacon?: boolean;
};
declare global {
    interface WebBridge {
        sendMessage(message: string): void;
    }
    const WebBridge: WebBridge | undefined;
}
