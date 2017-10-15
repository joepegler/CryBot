module.exports = (function () {

    "use strict";

    const moment = require('moment');
    const _ = require('lodash');

    return {
        price: (p) => {
            // {
            //     id : unique trade id (this trade id is unique to the exchange)
            //     exchange : name of the exchange
            //     symbol : currency pair (e.g. btcusd)
            //     date : Epoch timestamp millisecond (Note: only second level precision is given by the exchange, last three digits of millisecond timestamp is '000')
            //     price : in the quote currency (on a BTCEUR pair, the price is provided in EUR)
            //     amount : in the base currency (on a BTCEUR pair, the amount is in BTC)
            //     sell : boolean (TRUE or FALSE). Trade direction.
            // }
            let err = '';
            if (!p.exchange){
                return false;
            }
            else if ( !moment(p.date).isValid() ){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid timestamp: ' + p.date;
                return false;
            }
            else if (!p.symbol){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid pair: ' + p.symbol;
                return false;
            }
            else if (!_.isNumber(p.amount) || p.amount === 0 || p.amount === null || p.amount === 'null' || !p.amount){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid amount: ' + p.amount ;
                return false;
            }
            else if (!_.isNumber(p.price) || p.price === 0 || p.price === null || p.price === 'null' || !p.price){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid rate: ' + p.price ;
                return false;
            }
            else if (!_.includes([true, false, null], p.sell)){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'No type: ' + p.sell ;
                return false;
            }
            else {
                return true;
            }
            console.error(err);
        }
    }

})();