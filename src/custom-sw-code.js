self.addEventListener('push', e => {
  const data = e.data.json();
  console.log('Push Recieved', data);
  const { title } = data;
  const options = {
    body: `Movie has been downloaded`,
    vibrate: [300, 100, 400],
  };
  self.registration.showNotification(title, options);
});
/**
 * This is a script appended to the service worker. You will have noe access 
 * to dom elements in this script.
 * Notification.requestPermission().then(per => {
    console.log(per);
  });
 * should be done in the react app
 * 
 */

/*

if (!('Notification' in self.window)) {
  console.log('shits going down');
  alert('This browser does not support desktop notification');
}

console.log(Notification.permission !== 'denied');
setTimeout(() => {
  // Another things
  self.addEventListener('push', function(e) {
    const user = localStorage.getItem('user');
    console.log(user);
    const options = {
      body: `${user} This notification was generated from a push!`,
      vibrate: [100, 50, 100],
      actions: [
        {
          action: 'explore',
          title: 'Explore this new world',
        },
        {
          action: 'close',
          title: 'Close',
        },
      ],
    };
    e.waitUntil(self.registration.showNotification('Hello world!', options));
  });
});
*/
