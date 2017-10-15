module.exports = (function() {
    "use strict";
    const _ = require('lodash');
    const moment = require('moment');
    const request = require('request');
    const config = require('../config').exchanges.hitbtc;
    const rstUrl = config.url.rest;
    const pairData = config.pairs;
    const lastTradeTs = {};
    return {
        init: (fileWriter, pairs) => {
            setInterval(() => {
                _.each(pairs, pair => {
                    if(_.includes(Object.keys(pairData), pair)) {
                        if(!lastTradeTs[pair]) lastTradeTs[pair] = moment(new Date()).unix() * 1000;
                        let exPairName = pairData[pair];
                        let url = rstUrl + '/api/1/public/' + exPairName + '/trades?side=true&by=ts&from=' + lastTradeTs[pair];
                        request.get(url, (err, res, body) => {
                            if(!err) {
                                body = JSON.parse(body);
                                if(body && body.trades) {
                                    _.each(body.trades, trade => {
                                        let res = {
                                            ts: moment(trade[3]).add(0, 'hours').unix(),
                                            pair: pair,
                                            amount: parseFloat(trade[2]),
                                            rate: parseFloat(trade[1]),
                                            id: trade[0],
                                            type: trade[4],
                                            exchange: 'hitbtc'
                                        };
                                        fileWriter.write('hitbtc', res);
                                    });
                                    let last = _.last(body.trades);
                                    if(last) lastTradeTs[pair] = _.last(body.trades)[3];
                                }
                            }
                            else {
                                console.error(JSON.stringify(err));
                            }
                        });
                    }
                });
            }, 3000);
        }
    }
})();
