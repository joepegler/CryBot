module.exports = (function () {
    "use strict";
    const bittrex = require('node-bittrex-api');

    const moment = require('moment');
    const _ = require('lodash');
    const config = require('../config').exchanges.bittrex;
    const pairData = config.pairs;

    return {
        init: (db, pairs) => {
            let exchangePairs = _.values(pairData).filter(exchangePair => { return _.includes(pairs, _.invert(pairData)[exchangePair]); });
            bittrex.websockets.client(function () {
                bittrex.websockets.subscribe(_.values(pairData), function (data) {
                    if (data.M === 'updateExchangeState') {
                        _.each(data.A, dataPoints => {
                            _.each(dataPoints.Fills, fill => {
                                let res = {
                                    ts: parseInt( moment(fill.TimeStamp).add(1, 'hour').unix() ),
                                    pair: _.invert(pairData)[dataPoints.MarketName],
                                    amount: parseFloat(fill.Quantity),
                                    rate: parseFloat(fill.Rate),
                                    id: null,
                                    type: fill.OrderType === 'SELL' ? 'sell' : 'buy',
                                    exchange: 'bittrex'
                                };
                                db.write('bittrex', 'trades', res);
                            })
                        });
                    }
                });
            });
        }
    }

})();