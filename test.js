var bench = require('./index');

// Counter
var counter = new bench.Counter('loopCounter');
counter.start();
for (var i = 0; i < 100; ++i) {
  counter.incr();
}
counter.stop();

// Stopwatch
var stopwatch = new bench.Stopwatch('loopDuration');
stopwatch.start();
for (var i = 0; i < 100; ++i)
  ;
stopwatch.stop();

// Timestampable
var timestampable = new bench.Timestampable('rpcN');
timestampable.timestamp('received');
timestampable.timestamp('processed');
timestampable.timestamp('replied');

bench.print();
