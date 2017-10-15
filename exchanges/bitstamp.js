module.exports = (function () {

    "use strict";
    const _ = require('lodash');

    const Bitstamp = require('bitstamp');
    const bitstamp = new Bitstamp();

    const config = require('../config').exchanges.bitstamp;
    const pairData = config.pairs;

    return {
        init: function(db, pairs) {

            let exchangePairs = _.values(pairData).filter(exchangePair => { return _.includes(pairs, _.invert(pairData)[exchangePair]); });

            setInterval(() => {
                exchangePairs.forEach(ePair => {
                    bitstamp.transactions(ePair, function(err, trades) {
                        _.each(trades, trade => {
                            let res = {
                                ts: parseInt( trade.date ),
                                pair: _.invert(pairData)[ePair],
                                amount: parseFloat(trade.amount),
                                rate: parseFloat(trade.price),
                                id: trade.tid,
                                type: parseInt(trade.type) === 1 ? 'sell' : 'buy',
                                exchange: 'bitstamp'
                            };
                            db.write('bitstamp', 'trades', res);
                        })
                    });
                });
            }, 3000);
        }
    }

})();