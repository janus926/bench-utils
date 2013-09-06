var b = require('./bench-utils'),
    util = require('util');

new b.Timestamp('rpc0', 'appSvrData');
new b.Timestamp('rpc0', 'gwSvrData');

var s = new b.Stopwatch('loop0');
for (var i = 0; i < 3; ++i) {
    s.start();
    for (var j = 0; j < 1000; ++j)
        process.stdout.write('.');
    s.stop();
}

b.report();
