module.exports = (function() {
    "use strict";
    const _ = require('lodash');
    const Bitstamp = require('bitstamp');
    const bitstamp = new Bitstamp();
    const config = require('../config').exchanges.bitstamp;
    const pairData = config.pairs;
    return {
        init: function(fileWriter, pairs) {
            let exchangePairs = _.values(pairData).filter(exchangePair => { return _.includes(pairs, _.invert(pairData)[exchangePair]); });
            setInterval(() => {
                exchangePairs.forEach(ePair => {
                    bitstamp.transactions(ePair, function(err, trades) {
                        if(!err){
                            _.each(trades, trade => {
                                fileWriter.write('bitstamp', {
                                    date: parseInt(trade.date),
                                    symbol: _.invert(pairData)[ePair],
                                    amount: parseFloat(trade.amount),
                                    price: parseFloat(trade.price),
                                    id: trade.tid,
                                    sell: parseInt(trade.type) === 1,
                                    exchange: 'bitstamp'
                                });
                            })
                        }
                        else {
                            _.throttle(() => {
                                fileWriter.error(err, 'bitstamp');
                            }, 1000);
                        }

                    });
                });
            }, 5000);
        }
    }
})();