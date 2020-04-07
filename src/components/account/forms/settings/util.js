/* eslint-disable no-param-reassign */
const publicVapidKey = process.env.PUBLIC_KEY;

export const urlBase64ToUint8Array = () => {
  const padding = '='.repeat((4 - (publicVapidKey.length % 4)) % 4);
  const base64 = (publicVapidKey + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);

  const outputArray = new Uint8Array(rawData.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
