import { urlBase64ToUint8Array } from './util';

// To check `push notification` is supported or not
export const getSubscription = async () => {
  const serviceWorker = await navigator.serviceWorker.ready;
  const sub = await serviceWorker.pushManager.getSubscription();
  return sub;
};
export const isPushSupported = () => {
  // To check `push notification` permission is denied by user
  if (Notification.permission === 'denied') {
    return;
  }

  // Check `push notification` is supported or not
  if (!('PushManager' in window)) {
    return;
  }
  return true;
};
export const subscribePush = async () => {
  const serviceWorker = await navigator.serviceWorker.ready;
  if (!serviceWorker.pushManager) {
    return false;
  }
  const subscription = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(),
  });
  const stringifySub = JSON.stringify(subscription);
  return stringifySub;
};
export const unsubscribePush = async () => {
  const subscription = await getSubscription();
  if (!subscription) {
    return;
  }
  subscription.unsubscribe();
};
