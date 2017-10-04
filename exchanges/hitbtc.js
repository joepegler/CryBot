module.exports = (function () {
    "use strict";
    const _ = require('lodash');
    // const autobahn = require('autobahn');
    const moment = require('moment');

    const config = require('../config').exchanges.hitbtc;
    const wsUrl = config.url.ws;
    const pairData = config.pairs;

    let blTicker = io.connect('https://demo-api.hitbtc.com:8081/trades/LTCBTC');
    blTicker.on('trade', function(data) {
        console.log('LTCBTC demo ' + JSON.stringify(data));
    });

})();
