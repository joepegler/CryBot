module.exports = (function () {

    "use strict";
    const fs = require('fs');
    const _ = require('lodash');
    const WebSocket = require('ws');
    const ws = new WebSocket('wss://api.bitfinex.com/ws/2');

    const channels = [];

    ws.onmessage = (response) => {
        const data = JSON.parse(response.data);
        if (data.event){
            // console.info('data.event: ' + JSON.stringify(data));
            switch(data.event){
                case 'auth':
                    didAuthenticate(data);
                    break;
                case 'subscribed':
                    didSubscribe(data);
                    break;
                case 'info':
                    didGetMessage(data);
            }
        }
        else{
            const channel = _.find(channels, {chanId: data[0]}).channel;
            if(channel === 'trades'){
                if(data[1] === 'tu'){
                    updateTrades(data[2]);
                }
                else if (_.isArray(data[1])){
                    if(_.isArray(data[1][0])){
                        initTrades(data[1]);
                    }
                    else{
                        updateTrades(data[1]);
                    }
                }
            }
            else if(channel === 'book'){
                // console.log(data);
                if (_.isArray(data[1])){
                    if(_.isArray(data[1][0])){
                        initOrders(data[1]);
                    }
                    else{
                        updateOrders(data[1]);
                    }
                    updateOrders(data[1]);
                }
            }
        }
    };

    ws.onerror = (err) => {
        console.error(err);
    };

    ws.onopen = listen;

    function authenticate(){
        // const crypto = require('crypto-js');
        // const apiKey = '';
        // const apiSecret = '';
        // const authNonce = Date.now() * 1000;
        // const authPayload = 'AUTH' + authNonce;
        // const authSig = crypto.HmacSHA384(authPayload, apiSecret).toString(crypto.enc.Hex);
        // const payload = { apiKey, authSig, authNonce, authPayload, event: 'auth' };
        // ws.send(JSON.stringify(payload));
    }

    function listen(){
        ws.send(JSON.stringify({ event: "subscribe", channel: "trades", symbol: "tBTCUSD" }));
        ws.send(JSON.stringify({ event: "subscribe", channel: "book", symbol: "tBTCUSD" }));
    }

    function didSubscribe(channel){
        console.log('didSubscribe: Channel ' + channel.channel + '(' + channel.chanId + ')');
        channels.push(channel);
    }
    function didGetMessage(msg){
        console.log('didGetMessage: Version ' + msg.version);
    }
    function didAuthenticate(authData){
        console.info('didAuthenticate: ' + JSON.stringify(authData));
        listen();
    }
    function updateTrades(tradeInfo){
        // tradeInfo = {
        //     ID: tradeInfo[0],
        //     MTS: tradeInfo[1],
        //     AMOUNT: tradeInfo[2],
        //     PRICE: tradeInfo[3]
        // };
        console.log('updateTrades: ' + JSON.stringify(tradeInfo));
        // fs.appendFile("./store.txt", '\n' + JSON.stringify(tradeInfo), () => {});
    }
    function updateOrders(orderInfo){
        // orderInfo = {
        //     ID: tradeInfo[0],
        //     MTS: tradeInfo[1],
        //     AMOUNT: tradeInfo[2],
        //     PRICE: tradeInfo[3]
        // };
        console.log('updateOrders: ' + JSON.stringify(orderInfo));
    }

    function initTrades() { }

    function initOrders() { }

})();