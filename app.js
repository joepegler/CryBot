module.exports = (function () {
    "use strict";

    const express = require('express'),
        app = express(),
        _ = require('lodash'),
        helmet = require('helmet'),
        http = require('http').Server(app),
        io = require('socket.io')(http),
        exchangeConfigs = require('./config').exchanges,
        db = require('./utils/database');

    app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
    app.use(express.static(__dirname + '/www'));

    http.listen(3005, function () {
        console.log('listening on', 3005);
    });

    db.init(io);

    const pairs = ['btcusd', 'ltcbtc', 'ethbtc'];

    _.each(exchangeConfigs, (exchangeConfig, exchangeName) => {
        let exchange = require('./exchanges/' + exchangeName);
        exchange.init(db, pairs);
    });

})();