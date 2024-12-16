type TabCloseHandlerConfig = {
    url: string;
    data: object;
    useBeacon: boolean;
    isNavigation: () => boolean;
    resetNavigation: () => void;
};
/**
 * Sets up event listeners to handle tab close events.
 * @param config - Configuration object for tab close handlers.
 */
export declare function setupTabCloseHandlers({ url, data, useBeacon, isNavigation, resetNavigation, }: TabCloseHandlerConfig): void;
export {};
