module.exports = (function () {
    "use strict";
    const Gdax = require('gdax');

    return {
        init: function(db) {
            const websocket = new Gdax.WebsocketClient(['BTC-USD']);
            websocket.on('message', data => {
                switch(data.type){
                    case 'done':
                        db.write('gdax', 'trades', data);
                        break;
                    case 'open':
                    case 'received':
                        db.write('gdax', 'orders', data);
                        break;
                }
            });
            websocket.on('error', console.error);
            websocket.on('close', console.error);
        }
    }


})();