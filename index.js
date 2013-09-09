var hrtime = require('./lib/hrtime');

var counter = [];
var stopwatch = [];
var timestampable = [];

var utils = {

    Counter: function (name) {
        this.name = name;
        this.value = 0;
        this.elapsed = [0, 0];
        this.startTime = null;
        counter.push(this);
    },

    Stopwatch: function (name) {
        this.name = name;
        this.cycles = 0;
        this.startTime = null;
        this.totalElapsed = [0, 0];
        this.splits = 0;
        this.lastSplit = [0, 0];
        this.lapsElapsed = [0, 0];
        stopwatch.push(this);
    },

    Timestampable: function (name) {
        this.name = name;
        this.event = new Array();
        timestampable.push(this);
    },

    summary: function () {
        console.log('Counter:');
        for (var i = 0; i < counter.length; ++i)
            console.log('  ' + counter[i]);

        console.log('Stopwatch:');
        for (var i = 0; i < stopwatch.length; ++i)
            console.log('  ' + stopwatch[i]);

        console.log('Timestampable:');
        for (var i = 0; i < timestampable.length; ++i)
            console.log('  ' + timestampable[i]);
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
        this.elapsed = hrtime.add(this.elapsed, process.hrtime(this.startTime));
        this.startTime = null;
    }
};

utils.Counter.prototype.toString = function () {
    var ret = this.name + ' - ';
    if (this.startTime)
        return ret + 'running';
    ret += 'value=' + this.value +
           ', elapsed=' + hrtime.str(this.elapsed) +
           ' (' +
           (this.value / (this.elapsed[0] + (this.elapsed[1] / 1e9))).toFixed(6) +
           'times/sec)';
    return ret;
};

utils.Stopwatch.prototype.split = function () {
    if (this.startTime) {
        ++this.splits;
        var now;
        this.lapsElapsed = hrtime.add(this.lapsElapsed,
                                      hrtime.sub(now = process.hrtime(), this.lastSplit));
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
        this.totalElapsed = hrtime.add(this.totalElapsed, process.hrtime(this.startTime));
        this.startTime = null;
    }
};

utils.Stopwatch.prototype.toString = function () {
    var ret = this.name + ' - ';
    if (this.startTime)
        return ret + 'running';
    ret += 'cycles=' + this.cycles +
           ', total elapsed=' + hrtime.str(this.totalElapsed) +
           ' (' + hrtime.str(hrtime.div(this.totalElapsed, this.cycles)) + '/cycle)';
    if (this.splits)
        ret += ', splits=' + this.splits +
               ', laps elapsed=' + hrtime.str(this.lapsElapsed) +
               ' (' + hrtime.str(hrtime.div(this.lapsElapsed, this.splits)) + '/lap)';
    return ret;
};

utils.Timestampable.prototype.timestamp = function (event) {
    this.event.push([event, process.hrtime()]);
};

utils.Timestampable.prototype.toString = function () {
    var ret = this.name + ' - ' + this.event[0][0];
    for (var i = 1; i < this.event.length; ++i)
        ret += ' <' + hrtime.str(hrtime.sub(this.event[i][1], this.event[i - 1][1])) +
               '> ' + this.event[i][0];
    return ret;
};

module.exports = utils;
