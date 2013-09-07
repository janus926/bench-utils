var hrtime = require('./lib/hrtime');

var counter = {};
var stopwatch = {};
var timestamp = {};

var utils = {

    Counter: function (name) {
        this.value = 0;
        this.elapsed = [0, 0];
        this.startTime = null;
        counter[name] = this;
    },

    Stopwatch: function (name) {
        this.cycles = 0;
        this.startTime = null;
        this.totalElapsed = [0, 0];
        this.splits = 0;
        this.lastSplit = [0, 0];
        this.splitsElapsed = [0, 0];
        stopwatch[name] = this;
    },

    timestamp: function (thing, where) {
        if (!timestamp[thing])
            timestamp[thing] = {};
        timestamp[thing][where] = process.hrtime();
    },

    report: function () {
        console.log('Counter:');
        for (var name in counter) {
            var ctr = counter[name];
            var avg = (ctr.value / (ctr.elapsed[0] + (ctr.elapsed[1] / 1e9))).toFixed(6);
            console.log('  ' + name + ' - value=' + ctr.value +
                        ', elapsed=' + hrtime.str(ctr.elapsed) +
                        ', (' + avg + 'times/sec)');
        }

        console.log('Stopwatch:');
        for (var name in stopwatch) {
            var sw = stopwatch[name];
            var avg = hrtime.str(hrtime.div(sw.totalElapsed, sw.cycles));
            process.stdout.write('  ' + name + ' - cycles=' + sw.cycles +
                                 ', total elapsed=' + hrtime.str(sw.totalElapsed) +
                                 ' (' + avg + '/cycle)');
            if (sw.splits) {
                var avg = hrtime.str(hrtime.div(sw.splitsElapsed, sw.splits));
                process.stdout.write(', splits=' + sw.splits +
                                     ', splits elapsed=' + hrtime.str(sw.splitsElapsed) +
                                     ' (' + avg + '/split)');
            }
            process.stdout.write('\n');
        }

        console.log('Timestamp:');
        for (var thing in timestamp) {
            var array = [];
            for (var where in timestamp[thing])
                array.push([where, timestamp[thing][where]])
            array.sort(hrtime.cmp);
            process.stdout.write('  ' + thing + ' - ' + array[0][0]);
            for (var i = 1; i < array.length; ++i)
                process.stdout.write(' +' + hrtime.str(hrtime.sub(array[i][1], array[i - 1][1])) +
                                     ' > ' + array[i][0]);
            process.stdout.write('\n');
        }
    }
};

utils.Counter.prototype.incr = function () {
    ++this.value;
};

utils.Counter.prototype.decr = function () {
    --this.value;
};

utils.Counter.prototype.start = function () {
    if (!this.startTime)
        this.startTime = process.hrtime();
};

utils.Counter.prototype.stop = function () {
    if (this.startTime) {
        this.elapsed = hrtime.add(this.elapsed,
                                  hrtime.sub(process.hrtime(), this.startTime));
        this.startTime = null;
    }
};

utils.Stopwatch.prototype.split = function () {
    if (this.startTime) {
        ++this.splits;
        var now;
        this.splitsElapsed = hrtime.add(this.splitsElapsed,
                                      hrtime.sub((now = process.hrtime()), this.lastSplit));
        this.lastSplit = now;
    }
};

utils.Stopwatch.prototype.start = function () {
    if (!this.startTime)
        this.startTime = this.lastSplit = process.hrtime();
};

utils.Stopwatch.prototype.stop = function () {
    if (this.startTime) {
        ++this.cycles;
        this.totalElapsed = hrtime.add(this.totalElapsed,
                                       hrtime.sub(process.hrtime(), this.startTime));
        this.startTime = null;
    }
};

module.exports = utils;
