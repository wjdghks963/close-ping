import { detectNavigation } from '@utils/navigationDetector';
import { setupTabCloseHandlers } from './setupTabCloseHandlers';
import { ClosePingConfig } from '../types';

/**
 * Main function to handle sending data when a browser tab is closed.
 * @param config - Configuration object containing the URL and data.
 */
export function handleClosePing({ url, data, useBeacon = true }: ClosePingConfig): void {
  let isNavigation = false;

  const resetNavigation = () => {
    isNavigation = false; // Reset navigation state
  };

  // Detect navigation events
  detectNavigation(() => {
    isNavigation = true;
  });

  // Setup tab close handlers
  setupTabCloseHandlers({
    url,
    data,
    useBeacon,
    isNavigation: () => isNavigation,
    resetNavigation,
  });
}
