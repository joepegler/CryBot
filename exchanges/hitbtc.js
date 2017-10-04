module.exports = (function () {
    "use strict";
    const _ = require('lodash');
    const WebSocket = require('ws');
    const moment = require('moment');

    const config = require('../config').exchanges.hitbtc;
    const wsUrl = config.url.ws;
    const pairData = config.pairs;

    return {
        init: (db, pairs) => {}
    }



})();
