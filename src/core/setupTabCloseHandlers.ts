import { sendData } from './sendData';

type TabCloseHandlerConfig = {
  url: string;
  data: object;
  useBeacon: boolean;
  isNavigation: () => boolean; // Function to check if navigation occurred
  resetNavigation: () => void; // Function to reset navigation state
};

/**
 * Sets up event listeners to handle tab close events.
 * @param config - Configuration object for tab close handlers.
 */
export function setupTabCloseHandlers({
                                        url,
                                        data,
                                        useBeacon,
                                        isNavigation,
                                        resetNavigation,
                                      }: TabCloseHandlerConfig): void {
  let isSent = false;

  const sendOnClose = async () => {
    if (isSent) return; // Prevent duplicate execution
    isSent = true;

    try {
      if (useBeacon) {
        const success = navigator.sendBeacon(url, JSON.stringify(data));
        if (!success) await sendData(url, data); // Fallback to fetch with Keep-Alive
      } else {
        await sendData(url, data);
      }
    } finally {
      resetNavigation(); // Reset navigation state after request
    }
  };

  // Listen for tab close events
  window.addEventListener(
    'pagehide',
    (event) => {
      if (!event.persisted && !isNavigation()) sendOnClose();
    },
    { once: true },
  );

  window.addEventListener(
    'beforeunload',
    () => {
      if (!isNavigation()) sendOnClose();
    },
    { once: true },
  );
}
