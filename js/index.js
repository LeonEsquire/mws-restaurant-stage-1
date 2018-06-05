navigator.serviceWorker&&navigator.serviceWorker.register("/sw.js").then(function(){console.log("Registered serviceWorker")}).catch(function(){console.log("Error in registering serviceworker")});
