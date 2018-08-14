(function() {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register('/sw.js')
  .then(function() {
    console.log('Registered serviceWorker');
  })
  .catch(function() {
    console.log('Error in registering serviceworker');
  })

  // navigator.serviceWorker.ready.then(function(swRegistration) {
  //   return swRegistration.sync.register('myFirstSync');
  // });
})()
