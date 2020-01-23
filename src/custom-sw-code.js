setTimeout(() => {
  self.Notification.requestPermission().then(value => {
    console.log('value', value);
  });
  self.addEventListener('push', event => {
    console.log(event);
  });
}, 3000);
