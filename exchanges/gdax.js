module.exports = (function () {
    "use strict";
    const Gdax = require('gdax');
    const config = require('../config').exchanges.gdax;
    const pairData = config.pairs;

    return {
        init: function(db, pairs) {
            let exPairNames = Object.values(pairData);
            const websocket = new Gdax.WebsocketClient(exPairNames);
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