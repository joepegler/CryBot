module.exports = (function () {

    "use strict";
    const fs = require('fs');

    return {
        write : (exchangeName, table, object) => {
            let message = `\n[${exchangeName.toUpperCase()}] ` + JSON.stringify(object);
            // fs.appendFile("./" + table + ".txt", message, () => { console.log(message); });

            console.log(message);
        }
    }

})();