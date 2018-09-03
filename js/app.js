 if (navigator.serviceWorker) {

    navigator.serviceWorker.register('./sw.js')
    .then(function(reg){
        console.log("You made it. Your Service Worker is registered", reg);
    }).catch(function(err) {
        console.log('Service Worker failed!', err)
    });    
  } 

  
 
  