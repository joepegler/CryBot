module.exports = (function () {
    "use strict";
    const _ = require('lodash');
    const moment = require('moment');
    const uuid = require('uuid');

    const config = require('../config').exchanges.kraken;
    const pairData = config.pairs;

    return {
        init: (db, pairs)=>{
            const KrakenClient = require('@warren-bank/node-kraken-api');
            const kraken = new KrakenClient();
            let lastId;
            setInterval(()=>{
                let promises = pairs.map((pair, i) => {
                    return new Promise((resolve, reject) => {
                        if (_.includes(Object.keys(pairData), pair)) {
                            let exPairName = pairData[pair];
                            resolve(kraken.api('Trades', {'pair': exPairName, 'since': lastId}));
                        }
                        else{
                            reject('Wrong pair');
                        }
                    });
                });
                Promise.all(promises).then(results => {
                    _.each(results, (result, i) => {
                        let exPairName = pairData[pairs[i]];
                        lastId = result.last;
                        _.each(result[exPairName], (res) => {
                            let obj = {
                                datetime: moment(parseInt(res[2]).unix).format('YYYY-DD-MM HH:mm:ss'),
                                pair: pairs[i],
                                amount: res[1],
                                rate: res[0],
                                id: uuid.v4(),
                                type: res[3] === 's' ? 'sell' : 'buy',
                                exchange: 'kraken'
                            };
                            db.write('kraken', 'trades', obj);
                        });
                    });
                }).catch(console.error);
            }, 5000);

        }
    }

})();