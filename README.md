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
loop1.stop();
for1.stop();

rpc1.timestamp('replied');

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
  rpc1 - received <0.015879ms> processed <3.283273ms> replied
```

## API
### bench.Counter(name)
#### Counter.decr()
#### Counter.incr()
#### Counter.start()
#### Counter.stop()
#### Counter.toString()
### bench.Stopwatch(name)
#### Stopwatch.split()
#### Stopwatch.start()
#### Stopwatch.stop()
#### Stopwatch.toString()
### bench.Timestampable(name)
#### Timestampable.timestamp(event)
#### Timestampable.toString()
### bench.summary()
