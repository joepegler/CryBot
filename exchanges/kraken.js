module.exports = (function() {
    "use strict";
    const _ = require('lodash');
    const config = require('../config').exchanges.kraken;
    const pairData = config.pairs;
    return {
        init: (fileWriter, pairs) => {
            const KrakenClient = require('@warren-bank/node-kraken-api');
            const kraken = new KrakenClient();
            let lastId;

            setInterval(() => {
                let promises = pairs.map((pair, i) => {
                    return new Promise((resolve, reject) => {
                        if(_.includes(Object.keys(pairData), pair)) {
                            let exPairName = pairData[pair];
                            resolve(kraken.api('Trades', {'pair': exPairName, 'since': lastId}));
                        }
                        else {
                            reject('Wrong pair');
                        }
                    });
                });

                Promise.all(promises).then(results => {
                    _.each(results, (result, i) => {
                        let exPairName = pairData[pairs[i]];
                        lastId = result.last;
                        _.each(result[exPairName], (res) => {
                            fileWriter.write('kraken', {
                                date: parseInt(res[2]),
                                symbol: pairs[i],
                                amount: parseFloat(res[1]),
                                price: parseFloat(res[0]),
                                id: null,
                                sell: res[3] === 's',
                                exchange: 'kraken'
                            });
                        });
                    });
                }).catch(e => {
                    _.throttle(() => {
                        fileWriter.error(e, 'kraken');
                    }, 1000);
                });

            }, 5000);
        }
    }
})();