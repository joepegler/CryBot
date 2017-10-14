module.exports = (function () {

    "use strict";

    const moment = require('moment');
    const _ = require('lodash');

    return {
        price: (p) => {
            let err = '';
            if (!p.exchange){
                return false;
            }
            else if ( !moment(p.ts).isValid() ){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid timestamp: ' + p.ts;
                return false;
            }
            else if (!p.pair){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid pair: ' + p.pair;
                return false;
            }
            else if (!_.isNumber(p.amount) || p.amount === 0 || p.amount === null || p.amount === 'null' || !p.amount){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid amount: ' + p.amount ;
                return false;
            }
            else if (!_.isNumber(p.rate) || p.rate === 0 || p.rate === null || p.rate === 'null' || !p.rate){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'Invalid rate: ' + p.rate ;
                return false;
            }
            else if (!p.type){
                // err = '[' + p.exchange.toUpperCase() + '] ' + 'No type: ' + p.type ;
                return false;
            }
            else {
                return true;
            }
            // console.error(err);
        }
    }

})();