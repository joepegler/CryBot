module.exports = (function () {
    "use strict";
    const _ = require('lodash');
    const moment = require('moment');
    const WebSocket = require('ws');

    const config = require('../config').exchanges.bitfinex;
    const wsUrl = config.url.ws;
    const pairData = config.pairs;

    return {
        init: function(db, pairs) {

            let ws = new WebSocket(wsUrl);
            let channels = {};

            ws.onmessage = (response) => {
                const data = JSON.parse(response.data);
                if(data.event === 'subscribed'){
                    channels[_.invert(pairData)[data.symbol]] = data.chanId;
                }
                else if( data[1] === 'tu' ){
                    let res = {
                        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        pair:  _.invert(channels)[data[0]],
                        amount:  Math.abs(data[2][2]),
                        rate: data[2][3],
                        id: null,
                        type: data[2][2] > 0 ? 'buy' : 'sell',
                        exchange: 'bitfinex'
                    };
                    db.write('bitfinex', 'trades', res);
                }
            };

            ws.onopen = () => {
                pairs.forEach(pair => {
                    let exPairName = pairData[pair];
                    ws.send(JSON.stringify({event: "subscribe", channel: "trades", symbol: exPairName}));
                })
            };

            ws.onerror = console.error;

        }
    }

})();

