'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Sends data using the fetch API with the Keep-Alive option.
 * @param url - The URL to send the request to.
 * @param data - The data to include in the request body.
 */
function sendData(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json', // Indicate the data format
                    'Accept': 'application/json', // Request JSON response
                    'Connection': 'keep-alive', // Enable Keep-Alive
                },
                keepalive: true, // Allow background execution
            });
        }
        catch (error) {
            console.error('Keep-Alive request failed:', error);
        }
    });
}

function setupTabCloseHandlers({ url, data, useBeacon, resetNavigation, }) {
    var _a;
    let isSent = false;
    let isNavigating = false;
    let isReloading = false;
    // sendOnClose: 요청 전송 함수
    const sendOnClose = () => {
        if (isSent)
            return;
        isSent = true;
        try {
            const payload = JSON.stringify(data);
            if (useBeacon && navigator.sendBeacon) {
                navigator.sendBeacon(url, payload);
            }
            else {
                sendData(url, data);
            }
        }
        catch (error) {
            console.error('Error while sending data:', error);
        }
        finally {
            resetNavigation();
        }
    };
    // 새로고침 감지
    //@ts-ignore
    const navType = (_a = performance.getEntriesByType('navigation')[0]) === null || _a === void 0 ? void 0 : _a.type;
    isReloading = navType === 'reload' || navType === 'back_forward';
    // 페이지 이동 감지
    window.addEventListener('popstate', () => {
        isNavigating = true;
    });
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'A' && target.href) {
            isNavigating = true;
        }
    });
    // beforeunload: 최종 백업
    window.addEventListener('beforeunload', (event) => {
        if (!isNavigating && !isReloading) {
            sendOnClose();
        }
    });
    // pagehide: iOS Safari 대응
    window.addEventListener('pagehide', (event) => {
        if (!isNavigating && !isReloading) {
            sendOnClose();
        }
    });
    // pageshow: 플래그 초기화
    window.addEventListener('pageshow', () => {
        isNavigating = false;
        isReloading = false;
    });
}

/**
 * Main function to handle sending data when a browser tab is closed.
 * @param config - Configuration object containing the URL and data.
 */
function handleClosePing({ url, data, useBeacon = true }) {
    const resetNavigation = () => {
    };
    // Setup tab close handlers
    setupTabCloseHandlers({
        url,
        data,
        useBeacon,
        resetNavigation,
    });
}

exports.handleClosePing = handleClosePing;