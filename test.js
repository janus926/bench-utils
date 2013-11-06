var bench = require('./index');

// Counter
var counter = new bench.Counter('forLoopCounter');
counter.start();
for (var i = 0; i < 100; ++i) {
  counter.incr();
}
//counter.stop();
console.log(counter.toString());

// Stopwatch
var stopwatch = new bench.Stopwatch('forLoopDuration');
stopwatch.start();
for (var i = 0; i < 100; ++i)
  ;
stopwatch.stop();
console.log(stopwatch.toString());

// Timestampable
var rpc = new bench.Timestampable('rpc');
rpc.timestamp('received');
rpc.timestamp('processed');
rpc.timestamp('replied');
console.log(rpc.toString());
