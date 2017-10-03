module.exports = (function () {

    "use strict";

    const moment = require('moment');
    const _ = require('lodash');

    return {
        price: (p) => {
            if (!p.exchange){
                console.error('No exchange: ' + p.exchange );
                return false;
            }
            else if ( !moment(p.ts).isValid() ){
                console.error('[' + p.exchange.toUpperCase() + '] ' + 'Invalid timestamp: ' + p.ts);
                return false;
            }
            else if (!p.pair){
                console.error('[' + p.exchange.toUpperCase() + '] ' + 'Invalid pair: ' + p.pair);
                return false;
            }
            else if (!_.isNumber(p.amount) || p.amount === 0 || p.amount === null || p.amount === 'null' || !p.amount){
                console.error('[' + p.exchange.toUpperCase() + '] ' + 'Invalid amount: ' + p.amount );
                return false;
            }
            else if (!_.isNumber(p.rate) || p.rate === 0 || p.rate === null || p.rate === 'null' || !p.rate){
                console.error('[' + p.exchange.toUpperCase() + '] ' + 'Invalid rate: ' + p.rate );
                return false;
            }
            else if (!p.type){
                console.error('[' + p.exchange.toUpperCase() + '] ' + 'No type: ' + p.type );
                return false;
            }
            else {
                return true;
            }
        }
    }

})();