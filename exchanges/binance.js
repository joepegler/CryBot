module.exports = (function() {
    "use strict";
    const _ = require('lodash');
    const WebSocket = require('ws');
    const config = require('../config').exchanges.binance;
    const wsUrl = config.url.ws;
    const pairData = config.pairs;
    return {
        init: function(fileWriter, pairs) {
            let exchangePairs = _.values(pairData).filter(exchangePair => { return _.includes(pairs, _.invert(pairData)[exchangePair]); });
            exchangePairs.forEach(ePair => {
                let ws = new WebSocket(wsUrl + '/' + ePair + '@aggTrade');
                ws.on('message', trade => {
                    // {
                    //     "e": "aggTrade",		    // event type
                    //     "E": 1499405254326,		// event time
                    //     "s": "ETHBTC",			// symbol
                    //     "a": 70232,				// aggregated tradeid
                    //     "p": "0.10281118",		// price
                    //     "q": "8.15632997",		// quantity
                    //     "f": 77489,				// first breakdown trade id
                    //     "l": 77489,				// last breakdown trade id
                    //     "T": 1499405254324,		// trade time
                    //     "m": false,				// whehter buyer is a maker
                    //     "M": true				// can be ignore
                    // }
                    trade = JSON.parse(trade);
                    fileWriter.write('binance', {
                        date: parseInt(trade.E),
                        symbol: _.invert(pairData)[ePair],
                        amount: parseFloat(trade.q),
                        price: parseFloat(trade.p),
                        id: parseInt(trade.a),
                        sell: null,
                        exchange: 'binance'
                    });
                });
            })
        }
    }
})();