type TabCloseHandlerConfig = {
    url: string;
    data: object;
    useBeacon: boolean;
    resetNavigation: () => void;
};
export declare function setupTabCloseHandlers({ url, data, useBeacon, resetNavigation, }: TabCloseHandlerConfig): void;
export {};
