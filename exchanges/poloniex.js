module.exports = (function () {
    "use strict";
    const _ = require('lodash');
    const autobahn = require('autobahn');

    return {
        init: function(db){

            let connection = new autobahn.Connection({ url: "wss://api.poloniex.com", realm: "realm1" });

            connection.onopen = function (session) {
                session.subscribe('USDT_BTC', function(events) {
                    _.each(events, event => {
                        switch(event.type){
                            case 'newTrade':
                                db.write('poloniex', 'trades', event);
                                break;
                            case 'orderBookModify':
                            case 'orderBookRemove':
                                db.write('poloniex', 'orders', event);
                                break;
                        }
                    })
                });
            };

            connection.onclose = function (e) {
                console.log("Websocket connection closed: " + e.toString());
            };

            connection.open();

        }
    };

})();