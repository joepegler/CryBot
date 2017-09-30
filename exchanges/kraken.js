module.exports = (function () {
    "use strict";
    const _ = require('lodash');
    const moment = require('moment');

    return {
        init: (db)=>{
            const KrakenClient = require('@warren-bank/node-kraken-api');
            const kraken = new KrakenClient('mdov1KdvS7RzdWHjkj8+ZA4C3nKAxrnv8v+SCjByO2Ves2FF2mpIMtV0', 'Pr7csyWHfhKG6p6+XIBJ3r7VdG5vvAtpPwD8oOdjjwACTz6qAJ02YiTEqLFkl8uCBaMDVxDrABKPxZMD66uYow==', {timeout: 10000});

            const fields = ['price', 'volume', 'time', 'buy/sell', 'market/limit', 'miscellaneous'];
            let lastId = '';
            const pair = 'XBTUSD';

            setInterval(()=>{
                // Public API method: Get Ticker Info
                console.info('\n');
                kraken.api('Trades', {'pair': pair, 'since': lastId}).then((result) => {
                    // lastId = result.last;

                    // let resArr = [];
                    //
                    // _.each(result['XXBTZUSD'], (res) =>{
                    //
                    //     _.each(fields, (key, i) => {
                    //         let resO  { [key]: key === 'time' ? moment(parseInt(res[i]).unix).format('DD-MM HH:mm:ss') : res[i] };
                    //     });
                    //
                    //     resArr.push(fields.map((key, i) => {
                    //         return { [key]: key === 'time' ? moment(parseInt(res[i]).unix).format('DD-MM HH:mm:ss') : res[i] };
                    //     }));
                    // });
                    //
                    // console.info(resArr);

                }).catch(console.error);
            }, 5000);
        }
    }

})();
