module.exports = (function() {
    "use strict";
    const Gdax = require('gdax');
    const moment = require('moment');
    const _ = require('lodash');
    const config = require('../config').exchanges.gdax;
    const pairData = config.pairs;
    return {
        init: function(fileWriter, pairs) {
            let exchangePairs = _.values(pairData).filter(exchangePair => { return _.includes(pairs, _.invert(pairData)[exchangePair]); });
            exchangePairs.forEach(ePair => {
                let websocket = new Gdax.WebsocketClient(ePair);
                websocket.on('message', data => {
                    if(data.type === 'match') {
                        // {
                        //     type: 'done',
                        //     side: 'buy',
                        //     order_id: '62ead368-b379-4a50-b092-df0be315c904',
                        //     reason: 'filled',
                        //     product_id: 'BTC-USD',
                        //     sequence: 4208090442,
                        //     time: '2017-10-15T20:30:32.203000Z'
                        // }
                        fileWriter.write('gdax', {
                            date: parseInt(moment(data.time).unix()),
                            symbol: _.invert(pairData)[data.product_id],
                            amount: parseFloat(data.size),
                            price: parseFloat(data.price),
                            id: data['taker_order_id'],
                            sell: data.side === 'sell',
                            exchange: 'gdax'
                        });
                    }
                });
                websocket.on('error', e => {
                    _.throttle(() => {
                        fileWriter.error(e, 'gdax');
                    }, 1000);
                });
                websocket.on('close', e => {
                    _.throttle(() => {
                        fileWriter.error(e, 'gdax');
                        websocket = new Gdax.WebsocketClient(ePair);
                    }, 1000);
                });
            });
        }
    }
})();