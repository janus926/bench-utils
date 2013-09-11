var bench = require('./index');

var rpc1 = new bench.Timestampable('rpc1');

rpc1.timestamp('received');
rpc1.timestamp('processed');

var loop1 = new bench.Counter('loop1');
var for1 = new bench.Stopwatch('for1');
var block1 = new bench.Stopwatch('block1');
var dummy = 0;

loop1.start();
for1.start();
for (var i = 0; i < 1000; ++i) {
    loop1.incr();
    block1.start();
    dummy += i * 2;
    block1.stop();
    for1.split();
}
bench.counters.loop1.stop();
bench.stopwatches.for1.stop();

bench.timestampables['rpc1'].timestamp('replied');

bench.summary();
