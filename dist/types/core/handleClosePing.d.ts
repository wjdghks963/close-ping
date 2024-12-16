import { ClosePingConfig } from '../types';
/**
 * Main function to handle sending data when a browser tab is closed.
 * @param config - Configuration object containing the URL and data.
 */
export declare function handleClosePing({ url, data, useBeacon }: ClosePingConfig): void;
