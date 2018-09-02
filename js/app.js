 if (navigator.serviceWorker) {

    navigator.serviceWorker.register('./sw.js')
    .then(function(reg){
        console.log("You made it", reg);
    }).catch(function(err) {
        console.log('There is no content to display!', err)
    });    
  } 