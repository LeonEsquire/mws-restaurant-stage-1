document.addEventListener('DOMContentLoaded', function(event) {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register('/sw.js')
  .then(function(reg) {
    if ('sync' in reg) {
      // Accessing form
      const form = document.querySelector('#new_review');
      if(form) {
        // Getting id from url
        const url = new URL(window.location.href);
        const restaurant_id = parseInt(url.searchParams.get('id'));

        form.addEventListener('submit', function(event) {
          event.preventDefault();
          // Message if no internet
          if(!navigator.onLine) {
            const form = document.querySelector('#new_review > h3');
            const p = document.createElement('p');
            p.style.color = "red";
            const errorMessage = 'You are currently offline, but your review is saved and will be reposted once you are online again!'
            p.innerHTML = errorMessage;
            form.after(p);
          }

          // Exctracting data from form
          const name = document.querySelector('#name');
          const comments = document.querySelector('#comments');
          const rating = document.querySelector('#rating');

          const message = {
            name: name.value,
            comments: comments.value,
            rating: rating.value,
            restaurant_id: restaurant_id,
          };

          store.outbox('readwrite').then(function(outbox) {
            return outbox.put(message);
          }).then(function() {
            // Resetting form fields
            name.value = ''; comments.value = ''; rating.selectedIndex = 0;
            return reg.sync.register('outbox');
          }).catch(function(err) {
            // something went wrong with the database or the sync registration, log and submit the form
            console.error(err);
            form.submit();
          });

        });

      }
    }
  })
  .catch(function() {
    console.log('Error in registering serviceworker');
  })

  // navigator.serviceWorker.ready.then(function(swRegistration) {
  //   return swRegistration.sync.register('myFirstSync');
  // });

});
