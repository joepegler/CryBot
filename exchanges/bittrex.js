module.exports = (function() {
    "use strict";
    const bittrex = require('node-bittrex-api');
    const moment = require('moment');
    const _ = require('lodash');
    const config = require('../config').exchanges.bittrex;
    const pairData = config.pairs;
    return {
        init: (fileWriter, pairs) => {
            let exchangePairs = _.values(pairData).filter(exchangePair => { return _.includes(pairs, _.invert(pairData)[exchangePair]); });
            bittrex.websockets.client(function(discard, err) {
                bittrex.websockets.subscribe(exchangePairs, function(data, err) {
                    if(!err){
                        if(data.M === 'updateExchangeState') {
                            _.each(data.A, dataPoints => {
                                _.each(dataPoints.Fills, fill => {
                                    fileWriter.write('bittrex', {
                                        date: parseInt(moment(fill.TimeStamp).add(1, 'hour').unix()),
                                        symbol: _.invert(pairData)[dataPoints.MarketName],
                                        amount: parseFloat(fill.Quantity),
                                        price: parseFloat(fill.Rate),
                                        id: null,
                                        sell: fill.OrderType === 'SELL',
                                        exchange: 'bittrex'
                                    });
                                })
                            });
                        }
                    }
                    else {
                        _.throttle(() => {
                            fileWriter.error(err, 'bittrex');
                        }, 1000);
                    }
                });
            });
        }
    }
})();