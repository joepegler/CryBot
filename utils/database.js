module.exports = (function () {

    "use strict";
    const fs = require('fs');

    return {
        write : (exchangeName, table, object) => {
            fs.appendFile("./" + table + ".txt", '\n[' + exchangeName.toUpperCase() + '] ' + JSON.stringify(object), () => {});
        }
    }

})();