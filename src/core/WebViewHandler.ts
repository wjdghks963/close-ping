import { handleClosePing } from './handleClosePing';

/**
 * WebViewHandler: Handles WebView-specific close events and communication.
 */
export class WebViewHandler {
  private readonly url: string;
  private data: object;
  private appMessage: string;

  constructor(url: string, data: object, appMessage: string) {
    this.url = url;
    this.data = data;
    this.appMessage = appMessage;
  }

  /**
   * Starts handling WebView close events.
   */
  startWithBeacon(): void {
    handleClosePing({
      url: this.url,
      data: this.data,
    });

    this.setupWebBridge();
  }

  startWithFetch(): void {
    handleClosePing({
      url: this.url,
      data: this.data,
      useBeacon: false
    });

    this.setupWebBridge();
  }

  /**
   * Sends a message to the native app via WebBridge.
   */
  private setupWebBridge(): void {
    const sendToApp = () => {
      try {
        if (typeof WebBridge !== 'undefined' && typeof WebBridge.sendMessage === 'function') {
          WebBridge.sendMessage(this.appMessage);
        } else {
          console.warn('WebBridge is not available.');
        }
      } catch (error) {
        console.error('Failed to send message to the app:', error);
      }
    };

    // Hook into the same close events
    window.addEventListener(
      'pagehide',
      () => {
        sendToApp();
      },
      { once: true },
    );

    window.addEventListener(
      'beforeunload',
      () => {
        sendToApp();
      },
      { once: true },
    );
  }
}
