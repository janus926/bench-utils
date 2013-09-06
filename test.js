var bench = require('./index');

new bench.Timestamp('rpc0', 'station1');
new bench.Timestamp('rpc0', 'station2');

var sw = new bench.Stopwatch('loop0');
var dummy = 0;

for (var i = 0; i < 10000; ++i) {
    sw.start();
    dummy += i * 2;
    sw.stop();
}

new bench.Timestamp('rpc0', 'station3');

bench.report();
