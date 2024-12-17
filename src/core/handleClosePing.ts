import { detectUserEvent } from '@utils/detectUserEvent';
import { setupTabCloseHandlers } from './setupTabCloseHandlers';
import { ClosePingConfig } from '../types';

/**
 * Main function to handle sending data when a browser tab is closed.
 * @param config - Configuration object containing the URL and data.
 */
export function handleClosePing({ url, data, useBeacon = true }: ClosePingConfig): void {
  let isUserEventTriggered = false;

  const resetNavigation = () => {
    isUserEventTriggered = false; // Reset navigation state
  };

  // Detect navigation events
  detectUserEvent(() => {
    isUserEventTriggered = true;
  });

  // Setup tab close handlers
  setupTabCloseHandlers({
    url,
    data,
    useBeacon,
    resetNavigation,
  });
}
