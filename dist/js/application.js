if('serviceWorker' in navigator){

    navigator.serviceWorker.register('./SW.js')
    .then(registered => console.log(registered))
    .catch(error => console.log("Falló la instalación:",error))

}else console.log("Service Workers NO soportados");