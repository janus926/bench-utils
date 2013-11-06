var hrtime = require('./lib/hrtime');

var bench = {
  counters: {},
  stopwatches: {},
  timestampables: {},

  Counter: function(name) {
    this.name = name;
    this.value = 0;
    this.elapsed = undefined;
    this.startTime = undefined;
    bench.counters[name] = this;
  },

  Stopwatch: function(name) {
    this.name = name;
    this.cycles = 0;
    this.startTime = undefined;
    this.elapsed = undefined;
    bench.stopwatches[name] = this;
  },

  Timestampable: function(name) {
    this.name = name;
    this.events = [];
    bench.timestampables[name] = this;
  }
};

bench.Counter.prototype.decr = function(value) {
  if (typeof value === 'undefined')
    value = 1;
  this.vlaue -= value;
};

bench.Counter.prototype.incr = function(value) {
  if (typeof value === 'undefined')
     value = 1;
  this.value += value;
};

bench.Counter.prototype.reset = function() {
    this.value = 0;
    this.elapsed = undefined;
    this.startTime = undefined;
};

bench.Counter.prototype.start = function() {
  if (!this.startTime)
    this.startTime = process.hrtime();
};

bench.Counter.prototype.stop = function() {
  if (this.startTime) {
    this.elapsed = hrtime.add(this.elapsed, process.hrtime(this.startTime));
    this.startTime = undefined;
  }
};

bench.Counter.prototype.toString = function() {
  var elapsed = this.elapsed;

  if (typeof this.startTime !== 'undefined')
    elapsed = hrtime.add(elapsed, process.hrtime(this.startTime));

  return "[counter " + this.name
         + " value=" + this.value
         + (typeof elapsed !== 'undefined' ? " elapsed=" + hrtime.str(elapsed) : "")
         + "]";
}

bench.Stopwatch.prototype.reset = function() {
  this.cycles = 0;
  this.elapsed = undefined;
  this.startTime = undefined;
};

bench.Stopwatch.prototype.start = function() {
  if (!this.startTime)
    this.startTime = process.hrtime();
};

bench.Stopwatch.prototype.stop = function() {
  if (this.startTime) {
    ++this.cycles;
    this.elapsed = hrtime.add(this.elapsed, process.hrtime(this.startTime));
    this.startTime = undefined;
  }
};

bench.Stopwatch.prototype.toString = function() {
  var elapsed = this.elapsed;

  if (typeof this.startTime !== 'undefined')
    elapsed = hrtime.add(elapsed, process.hrtime(this.startTime));

  return "[stopwatch " + this.name
         + " cycles=" + this.cycles
         + (typeof elapsed !== 'undefined' ? " elapsed=" + hrtime.str(elapsed) : "")
         + "]";
}

bench.Timestampable.prototype.reset = function() {
  this.events = [];
};

bench.Timestampable.prototype.timestamp = function(event) {
  this.events.push([ event, process.hrtime() ]);
};

bench.Timestampable.prototype.toString = function() {
  var str = "[timestampable " + this.name + " " + this.events[0][0] + "=0ms";
  for (var i = 1; i < this.events.length; ++i) {
    str += " " + this.events[i][0] + "=" + hrtime.str(hrtime.sub(this.events[i][1], this.events[0][1]));
  }
  str += "]";
  return str;
}

module.exports = bench;
