import { sendData } from './sendData';

type TabCloseHandlerConfig = {
  url: string;
  data: object;
  useBeacon: boolean;
  resetNavigation: () => void;
};

export function setupTabCloseHandlers({
                                        url,
                                        data,
                                        useBeacon,
                                        resetNavigation,
                                      }: TabCloseHandlerConfig): void {
  let isSent = false;
  let isNavigating = false;
  let isReloading = false;

  // sendOnClose: 요청 전송 함수
  const sendOnClose = () => {
    if (isSent) return;
    isSent = true;

    try {
      const payload = JSON.stringify(data);
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(url, payload);
      } else {
        sendData(url, data);
      }
    } catch (error) {
      console.error('Error while sending data:', error);
    } finally {
      resetNavigation();
    }
  };

  // 새로고침 감지
  //@ts-ignore
  const navType = performance.getEntriesByType('navigation')[0]?.type;
  isReloading = navType === 'reload' || navType === 'back_forward' || navType === 'navigate';

  // 페이지 이동 감지
  window.addEventListener('popstate', () => {
    isNavigating = true;
  });

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLAnchorElement;
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
