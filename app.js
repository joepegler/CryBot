module.exports = (function () {
    "use strict";

    const pairs = ['btcusd', 'ltcbtc', 'ethbtc'];

    const db = require('./utils/database');
    const poloniex = require('./exchanges/poloniex');
    const bitfinex = require('./exchanges/bitfinex');
    const gdax = require('./exchanges/gdax');
    const kraken = require('./exchanges/kraken');

    // poloniex.init(db, pairs);
    // bitfinex.init(db, pairs);
    gdax.init(db, pairs);
    // kraken.init(db, pairs);

})();