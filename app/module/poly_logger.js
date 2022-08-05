const CronJob = require('cron').CronJob
const moment = require('moment')
const onHeaders = require('on-headers')
const fs = require("fs")
const path = require("path")
const archiver = require('archiver');

function getRemoteAddress(req) {
    var ip;
    var type;
    if (req.header['x-forwarded-for']) {
        type = "HTTP_X_FORWARDED_FOR "
        ip = req.headers['x-forwarded-for']
    } else if (req.connection.remoteAddress) {
        type = "REMOTE_ADDR "
        ip = req.connection.remoteAddress
    } else {
        type = "REMOTE_ADDR "
        ip = req.hostname
    }
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1);
    return type + ip
};

function generate(req, res, time, additional){
    var data = {
        method: req.method,
        url: req.protocol + '://' + req.headers.host + req.url,
        httpVersion: req.httpVersion,
        remoteAddress: getRemoteAddress(req),
        responseTime: time.toFixed(3),
        responseStatusCode: res.statusCode,
        useragent: req.headers['user-agent']
    }

    if(additional){
        for (var key in additional) {
            data[key] = additional[key]
        }
    }

    return data
}

function write_log(type, log_data){
    log_data = log_data + "\n"
    var datenow = moment().format("YYYY_MM_DD")
    var yearmonth = moment().format("YYYY_MM")
    var log = moment().format("HH:mm:ss") + "|" + log_data //here format timezone
    var logFolder = path.join(process.cwd(), "logs/"+type+"/"+yearmonth)

    if (!fs.existsSync(logFolder)) {
        const path = logFolder + "/"
        fs.mkdirSync(path, {recursive: true})
    }

    var file_path = logFolder+"/" + datenow + ".log"
    if (!fs.existsSync(file_path)) {
        fs.writeFileSync(file_path, log, { flag: 'w', mode: "0777" })
    } else {
        fs.writeFileSync(file_path, log, { flag: 'a', mode: "0777" })
    }
}

function compress(file_path, file_name){
    const output = fs.createWriteStream(file_path+'.gz');
    const archive = archiver('tar', {
        gzip:true,
        gzipOptions: { level: 9 }
    });
    archive.pipe(output)
    archive.file(file_path, {name:file_name})
    archive.finalize()
}

var deleteFolderRecursive = function (path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function log_rotate(){
    const job = new CronJob('00 00 00 * * *', async function() {
        var momentData = moment().subtract(1, 'days')
        var datenow = momentData.format("YYYY_MM_DD")
        var yearmonth = momentData.format("YYYY_MM")
        var deletedMoment = moment().subtract(7, 'months')
        var deleteYearMonth = deletedMoment.format("YYYY_MM")
        var folder = [
            path.join(process.cwd(), "logs/access/"),
            path.join(process.cwd(), "logs/panels/"),
            path.join(process.cwd(), "logs/api/"),
            path.join(process.cwd(), "logs/error/"),
            path.join(process.cwd(), "logs/debug/")
        ]

        for (let index = 0; index < folder.length; index++) {
            const element = folder[index];
            var zipfolder = element+yearmonth
            if (fs.existsSync(zipfolder)) {
                var file_path = zipfolder+"/" + datenow + ".txt"
                if (fs.existsSync(file_path)) {
                    compress(file_path, datenow + ".txt")
                    fs.unlinkSync(file_path)
                }
            }
            var deletefolder = element + deleteYearMonth
            if(fs.existsSync(deletefolder)){
                deleteFolderRecursive(deletefolder)
            }
        }
    });
    job.start();
}

module.exports = {
    access: function(app) {
        app.use(function(req, res, next){
            var startAt = process.hrtime()
            onHeaders(res, () => {
                var diff = process.hrtime(startAt)
                var time = diff[0] * 1e3 + diff[1] * 1e-6
                write_log("access", JSON.stringify(generate(req, res, time, null)))
            })
            if(next)
                next()
        })
        log_rotate()
    },
    error: function(data){
        if(!(data instanceof String))
            data = JSON.stringify(data)
        write_log("error", data)
    },
    debug: function(data){
        if(!(data instanceof String))
            data = JSON.stringify(data)
        write_log("debug", data)
    },
    panel: function(data){
        if(!(data instanceof String))
            data = JSON.stringify(data)
        write_log("panel", data)
    },
    api: function(data){
        if(!(data instanceof String))
            data = JSON.stringify(data)
        write_log("api", data)
    }
}