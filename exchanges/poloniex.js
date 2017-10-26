module.exports = (function() {
    "use strict";
    const _ = require('lodash');
    const autobahn = require('autobahn');
    const moment = require('moment');
    const config = require('../config').exchanges.poloniex;
    const wsUrl = config.url.ws;
    const pairData = config.pairs;
    return {
        init: function(fileWriter, pairs) {
            let connection = new autobahn.Connection({url: wsUrl, realm: 'realm1'});
            connection.onopen = function(session) {
                _.each(pairs, pair => {
                    if(_.includes(Object.keys(pairData), pair)) {
                        let exPairName = pairData[pair];
                        session.subscribe(exPairName, function(events) {
                            if(event.type === 'newTrade') {
                                fileWriter.write('poloniex', {
                                    date: moment(event.data.date).unix(),
                                    symbol: pair,
                                    amount: parseFloat(event.data.total),
                                    price: parseFloat(event.data.rate),
                                    id: event.data.tradeID,
                                    sell: event.data.type === 'sell',
                                    exchange: 'poloniex'
                                });
                            }
                        });
                    }
                });
            };
            connection.onerror = (e) => {
                _.throttle(() => {
                    fileWriter.error(e, 'poloniex');
                }, 1000);
            };
            connection.onclose = (e) => {
                _.throttle(() => {
                    fileWriter.error(e, 'poloniex');
                    connection.open();
                }, 1000);
            };
            connection.open();
        }
    };
})();