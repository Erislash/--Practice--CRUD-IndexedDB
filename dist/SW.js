self.addEventListener('install', e => {
    console.log("Sw instalado");
    console.log(e);
});


self.addEventListener('activate', e => {
    console.log("SW ACTIVADO");
    console.log(e);
});

self.addEventListener('fetch', e => {
    console.log('fetch...', e);
});
