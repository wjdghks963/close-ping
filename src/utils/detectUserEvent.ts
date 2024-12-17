/**
 * Detects navigation events (e.g., clicking a link, moving the mouse, pressing a key).
 * Calls the provided callback when a navigation event is detected.
 * @param onNavigate - Callback function to execute on navigation detection.
 */
export function detectUserEvent(onNavigate: () => void): void {
  // ['click', 'mousemove', 'keydown'].forEach((eventName) => {
  //   document.addEventListener(eventName, onNavigate, { once: true });
  // });
}
