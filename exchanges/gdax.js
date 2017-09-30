module.exports = (function () {
    "use strict";
    const Gdax = require('gdax');
    const moment = require('moment');
    const _ = require('lodash');
    const config = require('../config').exchanges.gdax;
    const pairData = config.pairs;

    return {
        init: function(db, pairs) {
            let exPairNames = Object.values(pairData);
            const websocket = new Gdax.WebsocketClient(exPairNames);
            websocket.on('message', data => {
                switch(data.type){
                    case 'received':
                        let res = {
                            datetime: moment(data.time).format('YYYY-MM-DD HH:mm:ss'),
                            pair: _.invert(pairData)[data.product_id],
                            amount:  data.size,
                            rate: data.price,
                            id: data.order_id,
                            type: data.side,
                            exchange: 'gdax'
                        };
                        db.write('gdax', 'trades', res);
                        break;
                    case 'open':
                        // db.write('gdax', 'orders', data);
                        break;
                }
            });
            websocket.on('error', console.error);
            websocket.on('close', console.error);
        }
    }

})();