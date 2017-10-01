module.exports = (function () {
    "use strict";
    const _ = require('lodash');
    const autobahn = require('autobahn');
    const moment = require('moment');

    const config = require('../config').exchanges.poloniex;
    const wsUrl = config.url.ws;
    const pairData = config.pairs;

    return {
        init: function(db, pairs){
            let connection = new autobahn.Connection({ url: wsUrl, realm: 'realm1' });
            connection.onopen = function (session) {

                console.info('opened...');

                _.each(pairs, pair => {
                    if ( _.includes(Object.keys(pairData), pair)){
                        let exPairName = pairData[pair];
                        session.subscribe(exPairName, function(events) {
                            _.each(events, event => {
                                switch(event.type){
                                    case 'newTrade':
                                        let res = {
                                            ts: moment(event.data.date).unix(),
                                            pair:  pair,
                                            amount: parseFloat(event.data.total),
                                            rate: parseFloat(event.data.rate),
                                            id: event.data.tradeID,
                                            type: event.data.type,
                                            exchange: 'poloniex'
                                        };
                                        db.write('poloniex', 'trades', res);
                                        break;
                                    case 'orderBookModify':
                                    case 'orderBookRemove':
                                        // db.write('poloniex', 'orders', event);
                                        break;
                                }
                            })
                        });
                    }
                });

            };

            connection.onclose = function (e, e2) {
                console.log(JSON.stringify(e));
                console.log(JSON.stringify(e2));
            };

            connection.onerror = console.error;

            connection.open();

        }
    };

})();