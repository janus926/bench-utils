var bench = require('./index');

bench.timestamp('rpc1', 'received');
bench.timestamp('rpc1', 'processed');

var c1 = new bench.Counter('counter1');
var sw1 = new bench.Stopwatch('stopwatch1');
var sw2 = new bench.Stopwatch('stopwatch2');
var dummy = 0;

c1.start();
sw1.start();
for (var i = 0; i < 1000; ++i) {
    c1.incr();
    sw2.start();
    dummy += i * 2;
    sw2.stop();
    sw1.split();
}
c1.stop();
sw1.stop();

bench.timestamp('rpc1', 'replied');

bench.summary();
