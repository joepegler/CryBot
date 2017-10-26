module.exports = (function() {
    "use strict";
    const _ = require('lodash');
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
                    fileWriter.write('bitfinex', {
                        date: parseInt(data[2][1] / 1000),
                        symbol: _.invert(channels)[data[0]],
                        amount: parseFloat(Math.abs(data[2][2])),
                        price: parseFloat(data[2][3]),
                        id: null,
                        sell: data[2][2] === 0,
                        exchange: 'bitfinex'
                    });
                }
            };
            ws.onopen = () => {
                pairs.forEach(pair => {
                    let exPairName = pairData[pair];
                    ws.send(JSON.stringify({event: "subscribe", channel: "trades", symbol: exPairName}));
                })
            };
            ws.onerror = err => {
                _.throttle(() => {
                    fileWriter.error(err, 'bitfinex');
                }, 1000);
            };
            ws.onclose = err => {
                _.throttle(() => {
                    fileWriter.error(err, 'bitfinex');
                    ws.onopen();
                }, 1000);
            }
        }
    }
})();
