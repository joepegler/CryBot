module.exports = (function () {

    "use strict";
    const fs = require('fs');
    const validator = require('./validate');
    let io;

    return {
        init: _io => {
            io = _io;
        },
        write : (exchangeName, table, object) => {
             if(validator.price(object)){
                 let message = `\n[${exchangeName.toUpperCase()}] ` + JSON.stringify(object);
                 // fs.appendFile("./" + table + ".txt", message, () => { console.log(message); });
                 console.log(message);
                 // io.emit('price', object);
             }
        },
    }

})();