/**
 * Configuration object for the ClosePing library.
 */
export type ClosePingConfig = {
  url: string; // The URL to send the request to
  data: object; // The data to include in the request body
  useBeacon?: boolean; // Whether to use the Beacon API (default: true)
};

declare global {
  interface WebBridge {
    sendMessage(message: string): void;
  }

  const WebBridge: WebBridge | undefined;
}
