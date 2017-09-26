module.exports = (function () {
    "use strict";

    const db = require('./utils/database');
    // const poloniex = require('./exchanges/poloniex');
    // const bitfinex = require('./exchanges/bitfinex');
    const gdax = require('./exchanges/gdax');

    // poloniex.init(db);
    // bitfinex.init(db);
    gdax.init(db);

})();