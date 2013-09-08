var hrtime = require('./lib/hrtime');

var counter = {};
var stopwatch = {};
var timestamp = {};

var utils = {

    Counter: function (name) {
        this.name = name;
        this.value = 0;
        this.elapsed = [0, 0];
        this.startTime = null;
        counter[name] = this;
    },

    Stopwatch: function (name) {
        this.name = name;
        this.cycles = 0;
        this.startTime = null;
        this.totalElapsed = [0, 0];
        this.splits = 0;
        this.lastSplit = [0, 0];
        this.lapsElapsed = [0, 0];
        stopwatch[name] = this;
    },

    timestamp: function (thing, where) {
        if (!timestamp[thing])
            timestamp[thing] = {};
        timestamp[thing][where] = process.hrtime();
    },

    summary: function () {
        console.log('Counter:');
        for (var name in counter)
            console.log('  ' + counter[name]);

        console.log('Stopwatch:');
        for (var name in stopwatch)
            console.log('  ' + stopwatch[name]);

        var compare = function (a, b) {
            var a0 = a[1][0];
            var b0 = b[1][0];
            if (a0 < b0)
                return -1;
            if (a0 > b0)
                return 1;
            var a1 = a[1][1];
            var b1 = b[1][1];
            if (a1 < b1)
                return -1;
            if (a1 > b1)
                return 1;
            return 0;
        };

        console.log('Timestamp:');
        for (var thing in timestamp) {
            var array = [];
            for (var where in timestamp[thing])
                array.push([where, timestamp[thing][where]])
            array.sort(compare);
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

utils.Counter.prototype.toString = function () {
    return this.name + ' - value=' + this.value + ', elapsed=' +
           hrtime.str(this.elapsed) + ', (' +
           (this.value / (this.elapsed[0] + (this.elapsed[1] / 1e9))).toFixed(6) +
           'times/sec)';
};

utils.Stopwatch.prototype.split = function () {
    if (this.startTime) {
        ++this.splits;
        var now;
        this.lapsElapsed = hrtime.add(this.lapsElapsed,
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

utils.Stopwatch.prototype.toString = function () {
    var ret = this.name + ' - ';
    if (this.cycles > 1)
        ret += 'cycles=' + this.cycles +
               ', total elapsed=' + hrtime.str(this.totalElapsed) +
               ' (' + hrtime.str(hrtime.div(this.totalElapsed, this.cycles)) + '/cycle)';
    if (this.splits)
        ret += (this.cycles > 1 ? ', splits=' : 'splits=') + this.splits +
               ', laps elapsed=' + hrtime.str(this.lapsElapsed) +
               ' (' + hrtime.str(hrtime.div(this.lapsElapsed, this.splits)) + '/lap)';
    return ret;
};

module.exports = utils;
