module.exports = (function() {
    "use strict";
    const _ = require('lodash');
    const moment = require('moment');
    const WebSocket = require('ws');
    const config = require('../config').exchanges.bitfinex;
    const wsUrl = config.url.ws;
    const pairData = config.pairs;
    return {
        init: function(fileWriter, pairs) {
            let ws = new WebSocket(wsUrl);
            let channels = {};
            ws.onmessage = (response) => {
                const data = JSON.parse(response.data);
                if(data.event === 'subscribed') {
                    channels[_.invert(pairData)[data.symbol]] = data.chanId;
                }
                else if(data[1] === 'tu') {
                    let res = {
                        ts: parseInt(data[2][1] / 1000),
                        pair: _.invert(channels)[data[0]],
                        amount: parseFloat(Math.abs(data[2][2])),
                        rate: parseFloat(data[2][3]),
                        id: null,
                        type: data[2][2] > 0 ? 'buy' : 'sell',
                        exchange: 'bitfinex'
                    };
                    fileWriter.write('bitfinex', res);
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
