module.exports = (function () {

    "use strict";
    const fs = require('fs');
    const _ = require('lodash');
    const schedule = require('node-schedule');
    const validator = require('./validate');
    let io, alarm, hourly = '0 * * * *';
    let fileOne = './files/current-batch.txt', fileTwo = './files/last-batch.txt';

    return {
        init: _io => {
            io = _io;
            alarm = schedule.scheduleJob(hourly, function(){
                fs.rename(fileOne, fileTwo, () => {
                    fs.readFile(fileTwo, 'utf8',  (err, data) => {
                        if (!err) {
                            let res = JSON.parse('[' + data.slice(0, -1) + ']');
                            console.log(res);
                        }
                    });
                });
            });
        },
        write : (exchangeName, table, object) => {
             if(validator.price(object)){
                 let message = JSON.stringify(object, null, 0) + ',';
                 fs.appendFile(fileOne, message, () => {io.emit('price', object);});
             }
        }
    }

})();
