# bench-utils

## Usage
```
var bench = require('./bench-utils');

bench.timestamp('rpc1', 'station1');
bench.timestamp('rpc1', 'station2');

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

bench.timestamp('rpc1', 'station3');

bench.report();
```
which will get output:
```
Counter:
  counter1 - value=1000, elapsed=3.157077ms, (316748.688740times/sec)
Stopwatch:
  stopwatch1 - splits=1000, laps elapsed=3.098828ms (0.003098ms/lap)
  stopwatch2 - cycles=1000, total elapsed=0.480179ms (0.00048ms/cycle)
Timestamp:
  rpc1 - station1 +0.015553ms > station2 +3.295119ms > station3

```

## API
### bench.Counter(name)
New a counter with a name.
#### decr()
#### incr()
#### start()
#### stop()
### bench.Stopwatch(name)
New a stopwatch with a name.
#### split()
#### start()
#### stop()
### bench.timestamp(thing, where)
Function to add something a timestamp from somewhere.
### bench.report()
