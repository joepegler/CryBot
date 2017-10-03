module.exports = (function () {
    "use strict";
    const Gdax = require('gdax');
    const moment = require('moment');
    const _ = require('lodash');
    const config = require('../config').exchanges.gdax;
    const pairData = config.pairs;

    return {
        init: function(db, pairs) {
            let exPairNames = _.values(pairData);
            const websocket = new Gdax.WebsocketClient(exPairNames);
            websocket.on('message', data => {
                if ( (data.type === 'done' && data.reason === 'filled') || data.type === 'match' ){
                    let res = {
                        ts: parseInt( moment(data.time).unix() ),
                        pair: _.invert(pairData)[data.product_id],
                        amount: parseFloat(data.size),
                        rate: parseFloat(data.price),
                        id: data.order_id,
                        type: data.side,
                        exchange: 'gdax'
                    };
                    db.write('gdax', 'trades', res);
                }
            });
            websocket.on('error', console.error);
            websocket.on('close', console.error);
        }
    }

})();