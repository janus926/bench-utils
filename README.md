# bench-utils

## Usage
```
var bench = require('bench-utils');

bench.timestamp('rpc0', 'station1');
bench.timestamp('rpc0', 'station2');

var sw = new bench.Stopwatch('loop0');
var dummy = 0;

for (var i = 0; i < 10000; ++i) {
    sw.start();
    dummy += i * 2;
    sw.stop();
}

bench.timestamp('rpc0', 'station3');

bench.report();
```
which will get output:
```
-- stopwatch --
loop0 - cycles=10000, elpased=4.021232ms, avg=0.000402ms
-- timestamp --
rpc0 - station1+0.015734ms > station2+8.165161ms > station3
```

## API
### bench.Stopwatch(id)
New a stopwatch with specific id.
#### start()
#### stop()
### bench.timestamp(objId, where)
Function to add a timestamp on objId from somewhere.
### bench.report()
