module.exports = (function () {
    "use strict";
    const Gdax = require('gdax');
    const moment = require('moment');
    const _ = require('lodash');
    const config = require('../config').exchanges.gdax;
    const pairData = config.pairs;

    return {
        init: function(db, pairs) {
            let exchangePairs = _.values(pairData).filter(exchangePair => { return _.includes(pairs, _.invert(pairData)[exchangePair]); });
            exchangePairs.forEach(ePair => {
                const websocket = new Gdax.WebsocketClient( ePair );
                websocket.on('message', data => {
                    if ( data.type === 'match' ){
                        // {
                        //     type: 'done',
                        //     side: 'buy',
                        //     order_id: '62ead368-b379-4a50-b092-df0be315c904',
                        //     reason: 'filled',
                        //     product_id: 'BTC-USD',
                        //     sequence: 4208090442,
                        //     time: '2017-10-15T20:30:32.203000Z'
                        // }
                        let res = {
                            ts: parseInt( moment(data.time).unix() ),
                            pair: _.invert(pairData)[data.product_id],
                            amount: parseFloat(data.size),
                            rate: parseFloat(data.price),
                            id: data['taker_order_id'],
                            type: data.side,
                            exchange: 'gdax'
                        };
                        db.write('gdax', 'trades', res);
                    }
                });
                websocket.on('error', console.error);
                websocket.on('close', console.error);
            });
        }
    }

})();