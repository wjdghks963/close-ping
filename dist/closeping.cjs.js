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
    const SESSION_KEY = 'tab_activity_count';
    let isSent = false; // 요청 중복 방지
    let isNavigating = false; // 페이지 이동 여부
    const sendOnClose = () => {
        if (isSent)
            return; // 중복 실행 방지
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
    const incrementSessionCount = () => {
        const count = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
        sessionStorage.setItem(SESSION_KEY, (count + 1).toString());
    };
    const resetSessionCount = () => {
        sessionStorage.setItem(SESSION_KEY, '0');
    };
    const isSessionCountZero = () => {
        const count = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
        return count === 0;
    };
    // 세션 초기화
    resetSessionCount();
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
    // visibilitychange: 탭 닫기와 전환 구분
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            incrementSessionCount();
        }
    });
    // beforeunload: 요청 실행
    window.addEventListener('beforeunload', () => {
        if (isSessionCountZero() && !isNavigating) {
            sendOnClose();
        }
    });
    // pagehide: iOS Safari 대응
    window.addEventListener('pagehide', (event) => {
        if (isSessionCountZero() && !isNavigating && !event.persisted) {
            sendOnClose();
        }
    });
    // pageshow: 세션 초기화
    window.addEventListener('pageshow', () => {
        resetSessionCount();
        isNavigating = false;
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
