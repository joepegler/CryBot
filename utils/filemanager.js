module.exports = (function() {

    "use strict";
    const fs = require('fs');
    const schedule = require('node-schedule');
    const JSZip = require("jszip");
    const config = require('../config');
    const validator = require('./validate');
    const s3 = require('s3');
    const moment = require('moment');
    let zip, io, alarm, hourly = '0 * * * * *';
    let fileOne = './logs/current-batch.txt', errFileName = './logs/error.log';

    let awsClient = s3.createClient({
        maxAsyncS3: 20,
        s3RetryCount: 3,
        s3RetryDelay: 1000,
        multipartUploadThreshold: 20971520,
        multipartUploadSize: 15728640,
        s3Options: {
            accessKeyId: config.aws.credentials.key,
            secretAccessKey: config.aws.credentials.secret,
            endpoint: 's3-website-us-east-1.amazonaws.com/',
            // signatureVersion: 'v4',
            region: 'us-east-1'
        }
    });

    let fileManager = {
        init: _io => {
            io = _io;
            zip = new JSZip();
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

            let batchName = moment(new Date()).format('YY-DD-MM_HH-mm') + '.json';
            let fileTwo = './logs/' + batchName;
            let zipFile = fileTwo + '.zip';

            fs.rename(fileOne, fileTwo, () => {
                fs.readFile(fileTwo, 'utf8', (e, data) => {

                    let jsonString = '[' + data.slice(0, -1) + ']';

                    zip.file(batchName, jsonString);

                    zip.generateNodeStream({type: 'nodebuffer', streamFiles: true}).pipe(fs.createWriteStream(zipFile)).on('finish', () => {
                        // JSZip generates a readable stream with a "end" event,
                        // but is piped here in a writable stream which emits a "finish" event.
                        console.log(fileTwo + '.zip written.');
                        let uploader = awsClient.uploadFile({
                            localFile: zipFile,
                            s3Params: {
                                Bucket: config.aws.credentials.bucket,
                                Key: batchName
                            }
                        });
                        uploader.on('error', err => {
                            fileManager.error(err, 'fileUploader');
                        }).on('progress', () => {
                            // console.log('progress: ' + Math.round(uploader.progressAmount * 100 / uploader.progressTotal) + '%' );
                            console.log('uploader.progressAmount: ' + uploader.progressAmount);
                            console.log('uploader.progressTotal: ' + uploader.progressTotal);
                        }).on('end', () => {
                            console.log('ended');
                            fs.unlink(fileTwo);
                            fs.unlink(zipFile);
                        });
                    });
                });
            });
        }
    };

    return fileManager;

})();