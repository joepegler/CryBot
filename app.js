module.exports = (function () {
    "use strict";

    const express = require('express'),
        app = express(),
        helmet = require('helmet'),
        http = require('http').Server(app),
        io = require('socket.io')(http);

    app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
    app.use(express.static(__dirname + '/www'));

    http.listen(3005, function () {
        console.log('listening on', 3005);
    });

    const db = require('./utils/database');
    const poloniex = require('./exchanges/poloniex');
    const bittrex = require('./exchanges/bittrex');
    const bitfinex = require('./exchanges/bitfinex');
    const gdax = require('./exchanges/gdax');
    const kraken = require('./exchanges/kraken');

    const pairs = ['btcusd', 'ltcbtc', 'ethbtc'];

    db.init(io);

    // poloniex.init(db, pairs);
    bitfinex.init(db, pairs);
    bittrex.init(db, pairs);
    gdax.init(db, pairs);
    kraken.init(db, pairs);

})();