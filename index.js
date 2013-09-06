var hrtime = require('./lib/hrtime');

var utils = {
    stopwatches: {},
    timestamps: {},

    Stopwatch: function (id) {
        this.cycles = 0;
        this.elapsed = [0, 0];
        this.startTime = null;
        utils.stopwatches[id] = this;
    },

    timestamp: function (objId, where) {
        var now = process.hrtime();
        if (!utils.timestamps[objId])
            utils.timestamps[objId] = {};
        utils.timestamps[objId][where] = now;
    },

    report: function () {
        console.log('-- stopwatch --');
        var sw;
        for (var id in utils.stopwatches) {
            sw = utils.stopwatches[id];
            console.log(id,
                        '- cycles=' + sw.cycles +
                        ', elpased=' + hrtime.str(sw.elapsed) +
                        ', avg=' + hrtime.str(hrtime.div(sw.elapsed, sw.cycles)));
        }

        console.log('-- timestamp --');
        for (var objId in utils.timestamps) {
            var array = [];
            for (var ts in utils.timestamps[objId])
                array.push([ts, utils.timestamps[objId][ts]])
            array.sort(hrtime.compare);
            process.stdout.write(objId + ' - ' + array[0][0]);
            for (var i = 1; i < array.length; ++i)
                process.stdout.write('+' + hrtime.str(hrtime.sub(array[i][1], array[i - 1][1])) +
                                     ' > ' + array[i][0]);
            process.stdout.write('\n');
        }
    }
};

utils.Stopwatch.prototype.start = function () {
    if (!this.startTime)
        this.startTime = process.hrtime();
};

utils.Stopwatch.prototype.stop = function () {
    if (this.startTime) {
        var now = process.hrtime();
        this.elapsed = hrtime.add(this.elapsed, hrtime.sub(now, this.startTime));
        ++this.cycles;
        this.startTime = null;
    }
};

module.exports = utils;
