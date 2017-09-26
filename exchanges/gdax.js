// module.exports = (function () {
//
//     "use strict";
//
//     const Gdax = require('gdax');
//
//     return {
//         init: function() {
//
//             const websocket = new Gdax.WebsocketClient(['BTC-USD']);
//
//             websocket.on('message', data => {
//
//                 console.log(data);
//
//                 // switch(data.type){
//                 //     case 'done':
//                 //         // db.write('gdax', 'trades', data);
//                 //         break;
//                 //     case 'open':
//                 //     case 'received':
//                 //         // db.write('gdax', 'orders', data);
//                 //         break;
//                 // }
//             });
//             websocket.on('error', console.error);
//             websocket.on('close', console.error);
//         }
//     }
//
//
// })();

const Gdax = require('gdax');
var websocket = new Gdax.WebsocketClient(
    ['BTC-USD'],
    'https://api-public.sandbox.gdax.com',
    {
        key: 'suchkey',
        secret: 'suchsecret',
        passphrase: 'muchpassphrase',
    },
    { heartbeat: true }
);

websocket.on('message', console.log);
websocket.on('error', err => { /* handle error */ });
websocket.on('close', () => { /* ... */ });
