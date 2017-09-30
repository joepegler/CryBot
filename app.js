module.exports = (function () {
    "use strict";

    const db = require('./utils/database');
    // const poloniex = require('./exchanges/poloniex');
    // const bitfinex = require('./exchanges/bitfinex');
    // const gdax = require('./exchanges/gdax');
    const kraken = require('./exchanges/kraken');

    // poloniex.init(db);
    // bitfinex.init(db);
    // gdax.init(db);
    kraken.init(db);

})();