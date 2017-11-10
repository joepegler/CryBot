module.exports = (function() {

    "use strict";
    const fs = require('fs');
    const schedule = require('node-schedule');
    const config = require('../config');
    const validator = require('./validate');
    const AWS = require('aws-sdk');
    const moment = require('moment');
    let io, alarm, hourly = '0 * * * * *';
    let fileOne = './logs/current-batch.txt', errFileName = './logs/error.log';

    AWS.config.update({
        accessKeyId: config.aws.credentials.key,
        secretAccessKey: config.aws.credentials.secret
    });

    let fileManager = {
        init: _io => {
            io = _io;
            alarm = schedule.scheduleJob(hourly, fileManager.upload);
        },
        write: (exchangeName, object) => {
            if(validator.price(object)) {
                let message = JSON.stringify(object, null, 0) + ',';
                fs.appendFile(fileOne, message, () => {
                    io && io.emit('price', object);
                });
            }
        },
        error: (err, exchangeName, callback) => {
            err = '[' + moment(new Date())
                .format('YY-DD-MM HH:mm:ss') + ']' + exchangeName.toUpperCase() + ': ' + (typeof err === 'string' ? err : (err.message ? err.message : JSON.stringify(err))) + '\n';
            fs.appendFile(errFileName, err);
            callback && callback();
        },
        upload: () => {
            let timestamp = moment(new Date()).format('YY-DD-MM_HH-mm');
            let jsonFileName = timestamp + '.json';
            let fileTwoPwd = './logs/' + jsonFileName;
            fs.rename(fileOne, fileTwoPwd, () => {
                fs.readFile(fileTwoPwd, 'utf8', (e, data) => {
                    let jsonString = '[' + data.slice(0, -1) + ']';
                    let s3 = new AWS.S3();
                    let base64data = new Buffer(jsonString, 'binary');
                    s3.upload({
                        Bucket: config.aws.credentials.bucket,
                        Key: jsonFileName,
                        Body: base64data,
                        ACL: 'public-read'
                    }, function(resp) {
                        console.log(arguments);
                        fs.unlink(fileTwoPwd);
                    });
                });
            });
        }
    };

    return fileManager;

})();