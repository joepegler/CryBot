module.exports = (function () {
    "use strict";

    const _ = require('lodash'),
    exchangeConfigs = require('./config').exchanges,
    filemanager = require('./utils/filemanager'),
    uiMode = _.includes(process.argv, 'ui');
    let io;

    function startUi(){
        const express = require('express'),
            app = express(),
            helmet = require('helmet'),
            http = require('http').Server(app);
        io = require('socket.io')(http);
        app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
        app.use(express.static(__dirname + '/www'));
        http.listen(3005, function () { console.log('listening on', 3005); });
    }

    uiMode && startUi();
    filemanager.init(io);
    const pairs = ['btcusd'];

    _.each(exchangeConfigs, (exchangeConfig, exchangeName) => {
        let exchange = require('./exchanges/' + exchangeName);
        exchange.init(filemanager, pairs);
    });

})();