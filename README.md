# bench-utils

## Usage
```
var bench = require('./bench-utils');

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
bench.stopwatches['for1'].stop();

bench.timestampables['rpc1'].timestamp('replied');

bench.summary();
```
which will get output:
```
Counter:
  loop1 - value=1000, elapsed=3.142625ms (318205.321984times/sec)
Stopwatch:
  for1 - cycles=1, total elapsed=3.156229ms (3.156229ms/cycle), splits=1000, laps elapsed=3.082689ms (0.003082ms/lap)
  block1 - cycles=1000, total elapsed=0.465914ms (0.000465ms/cycle)
Timestampable:
  rpc1 - received -> processed (+0.011471ms) -> replied (+3.475012ms)
```

## API
### bench.counters
### bench.stopwaches
### bench.timestampables
Use the instances collection to ease your application from passing
them around.
### bench.summary([regexp])
### class Counter
### Counter(name)
#### counter.decr([value])
#### counter.incr([value])
#### counter.start()
#### counter.stop()
#### counter.toString()
### class Stopwatch
### Stopwatch(name)
#### stopwatch.split()
#### stopwatch.start()
#### stopwatch.stop()
#### stopwatch.toString()
### class Timestampable
### Timestampable(name)
#### timestampable.timestamp(event)
#### timestampable.toString()

