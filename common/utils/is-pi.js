export default function isPi() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  // return /pi/.test(ua);
  // todo: 待改写pi浏览器判断
  return true;
}
