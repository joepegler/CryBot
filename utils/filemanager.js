module.exports = (function () {

    "use strict";
    const fs = require('fs');
    const schedule = require('node-schedule');
    const validator = require('./validate');
    const moment = require('moment');
    let io, alarm, hourly = '0 * * * *';
    let fileOne = './logs/current-batch.txt', fileTwo = './logs/last-batch.txt', errFileName = './logs/error.log';

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
        write : (exchangeName, object) => {
             if(validator.price(object)){
                 let message = JSON.stringify(object, null, 0) + ',';
                 fs.appendFile(fileOne, message, () => { io && io.emit('price', object); });
             }
        },
        error: (err, exchangeName, callback) => {
            err = '[' +  moment( new Date() ).format('YY-DD-MM HH:mm:ss') + ']' + exchangeName.toUpperCase() + ': ' + (typeof err === 'string' ? err : (err.message ? err.message : JSON.stringify(err))) + '\n';
            fs.appendFile(errFileName, err);
            callback && callback();
        }
    }

})();