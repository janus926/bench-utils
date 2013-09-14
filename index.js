var hrtime = require('./lib/hrtime');
var sprintf = require('sprintf').sprintf;

var utils = {

    counters: {},
    stopwatches: {},
    timestampables: {},

    Counter: function (name) {
        this.name = name;
        this.value = 0;
        this.elapsed = [0, 0];
        this.startTime = null;
        utils.counters[name] = this;
    },

    Stopwatch: function (name) {
        this.name = name;
        this.cycles = 0;
        this.startTime = null;
        this.totalElapsed = [0, 0];
        this.splits = 0;
        this.lastSplit = [0, 0];
        this.lapsElapsed = [0, 0];
        utils.stopwatches[name] = this;
    },

    Timestampable: function (name) {
        this.name = name;
        this.event = [];
        utils.timestampables[name] = this;
    },


    summary: function (regexp) {
	var reIsDefined = (typeof regexp !== 'undefined');
	var counters = utils.counters;
	var stopwatches = utils.stopwatches;
	var timestampables = utils.timestampables;

	console.log('- COUNTER -');
	console.log(sprintf('%-7s%7s %-15s%-15s',
			    'NAME', 'VALUE', 'ELAPSED', 'TIMES/SEC'));
	for (var name in counters) {
            if (reIsDefined && !regexp.test(name))
		continue;
	    var c = counters[name];
	    var elapsed = c.startTime ? process.hrtime(c.startTime) : c.elapsed;
	    console.log(sprintf('%-7s%7s %-15s%-15s',
				name, c.value,
				hrtime.str(elapsed),
				(c.value / (elapsed[0] + (elapsed[1] / 1e9))).toFixed(6)));
	}

	console.log('- STOPWATCH -');
	console.log(sprintf('%-7s%7s %-15s%-15s%6s %-15s%-13s',
			    'NAME', 'CYCLES', 'ELAPSED', 'CYCLE TIME',
			    'SPLITS', 'ELAPSED', 'SPLIT TIME'));
	for (var name in stopwatches) {
            if (reIsDefined && !regexp.test(name))
		continue;
	    var sw = stopwatches[name];
	    var totalElapsed = sw.startTime ? process.hrtime(sw.startTime) : sw.totalElapsed;
	    console.log(sprintf('%-7s%7s %-15s%-15s%6s %-15s%-13s',
				name, sw.cycles, hrtime.str(totalElapsed),
				hrtime.str(hrtime.div(totalElapsed, sw.cycles)),
				sw.splits, hrtime.str(sw.lapsElapsed),
				hrtime.str(hrtime.div(sw.lapsElapsed, sw.splits))));
	}

	console.log('- TIMESTAMPABLE -');
	console.log(sprintf('%-8s%-12s %-15s%-15s',
			    'NAME', 'EVENT', 'DIFF', 'CUMULATIVE'));
	for (var name in timestampables) {
            if (reIsDefined && !regexp.test(name))
		continue;
	    var ts = timestampables[name];
	    var cumulative = [0, 0];
	    console.log(sprintf('%-8s%-12s %-15s%-15s', name, ts.event[0][0], '-', '0ms'));
	    for (var i = 1; i < ts.event.length; ++i) {
		var diff = hrtime.sub(ts.event[i][1], ts.event[i - 1][1]);
		cumulative = hrtime.add(cumulative, diff);
		console.log(sprintf('%-8s%-12s %-15s%-15s',
				    '', ts.event[i][0], 
				    hrtime.str(diff), hrtime.str(cumulative)));
	    }
	}
    }
};

utils.Counter.prototype.decr = function (value) {
    if (typeof value === 'undefined')
        value = 1;
    this.vlaue -= value;
};

utils.Counter.prototype.incr = function (value) {
    if (typeof value === 'undefined')
        value = 1;
    this.value += value;
};

utils.Counter.prototype.reset = function () {
    this.value = 0;
    this.elapsed = [0, 0];
    this.startTime = null;
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

utils.Stopwatch.prototype.reset = function () {
    this.cycles = 0;
    this.startTime = null;
    this.totalElapsed = [0, 0];
    this.splits = 0;
    this.lastSplit = [0, 0];
    this.lapsElapsed = [0, 0];
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

utils.Timestampable.prototype.reset = function () {
    this.event = [];
};

utils.Timestampable.prototype.timestamp = function (event) {
    this.event.push([event, process.hrtime()]);
};

module.exports = utils;
