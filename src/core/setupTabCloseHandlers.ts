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
  let isSent = false; // 요청 중복 방지
  let isNavigating = false; // 페이지 이동 여부
  let isReloading = false; // 새로고침 여부
  let isTabClosing = false; // 탭 닫힘 여부

  const sendOnClose = () => {
    if (isSent) return; // 중복 실행 방지
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

  // 초기 로드 및 새로고침 상태 확인
  //@ts-ignore
  const navType = performance.getEntriesByType('navigation')[0]?.type;
  isReloading = navType === 'reload' || navType === 'back_forward';

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      isReloading = true;
    } else {
      const navEntry = performance.getEntriesByType('navigation')[0];
      //@ts-ignore
      isReloading = navEntry?.type === 'reload' || navEntry?.type === 'back_forward';
    }
    isNavigating = false;
    isTabClosing = false;
    isSent = false;
  });

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

  // visibilitychange: 탭 닫기와 전환 구분
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!isNavigating && !isReloading && !isTabClosing) {
        isTabClosing = true; // 탭 닫힘으로 간주
        sendOnClose(); // 요청 실행
      } else {
        console.log('Tab switch detected, no request sent.');
      }
    }
  });

  // beforeunload: 최종 요청 처리
  window.addEventListener('beforeunload', () => {
    if (!isNavigating && !isReloading) {
      isTabClosing = true; // 탭 닫힘 설정
      sendOnClose(); // 백업 요청
    }
  });

  // pagehide: iOS Safari 대응
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) {
      isTabClosing = true; // 탭 닫힘 설정
      if (!isNavigating && !isReloading) {
        sendOnClose();
      }
    }
  });
}
