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
                                let res = {
                                    ts: moment(event.data.date).unix(),
                                    pair: pair,
                                    amount: parseFloat(event.data.total),
                                    rate: parseFloat(event.data.rate),
                                    id: event.data.tradeID,
                                    type: event.data.type,
                                    exchange: 'poloniex'
                                };
                                fileWriter.write('poloniex', res);
                            }
                        });
                    }
                });
            };
            connection.onerror = console.error;
            connection.open();
        }
    };
})();