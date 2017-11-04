module.exports = (function () {

    "use strict";
    const fs = require('fs');
    const schedule = require('node-schedule');
    const config = require('../config');
    const validator = require('./validate');
    const s3 = require('s3');
    const moment = require('moment');
    let io, alarm, hourly = '0 * * * *';
    let fileOne = './logs/current-batch.txt', fileTwo = './logs/last-batch.txt', errFileName = './logs/error.log';

    let awsClient = s3.createClient({
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
            accessKeyId: config.aws.credentials.key,
            secretAccessKey: config.aws.credentials.secret,
            // region: "your region",
            // endpoint: 's3.yourdomain.com',
            // sslEnabled: false
            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
        },
    });

    return {
        init: _io => {
            io = _io;
            alarm = schedule.scheduleJob(hourly, function(){
                fs.rename(fileOne, fileTwo, () => {
                    fs.readFile(fileTwo, 'utf8',  (err, data) => {
                        if (!err) {
                            let res = JSON.parse('[' + data.slice(0, -1) + ']');
                            console.log(res);

                            let params = {
                                localFile: "some/local/file",
                                s3Params: {
                                    Bucket: "live-loot-data",
                                    Key: "some/remote/file",
                                    // other options supported by putObject, except Body and ContentLength.
                                    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
                                },
                            };
                            let uploader = client.uploadFile(params);
                            uploader.on('error', function(err) {
                                console.error("unable to upload:", err.stack);
                            });
                            uploader.on('progress', function() {
                                console.log("progress", uploader.progressMd5Amount,
                                    uploader.progressAmount, uploader.progressTotal);
                            });
                            uploader.on('end', function() {
                                console.log("done uploading");
                            });

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