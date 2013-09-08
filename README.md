# bench-utils

## Usage
```
var bench = require('./bench-utils');

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
```
which will get output:
```
Counter:
  counter1 - value=1000, elapsed=3.192441ms, (313239.931451times/sec)
Stopwatch:
  stopwatch1 - splits=1000, laps elapsed=3.135265ms (0.003135ms/lap)
  stopwatch2 - cycles=1000, total elapsed=0.478917ms (0.000478ms/cycle)
Timestamp:
  rpc1 - received +0.014971ms > processed +3.330493ms > replied
```

## API
### bench.Counter(name)
New a counter with a name.
#### Counter.decr()
#### Counter.incr()
#### Counter.start()
#### Counter.stop()
### bench.Stopwatch(name)
New a stopwatch with a name.
#### Stopwatch.split()
#### Stopwatch.start()
#### Stopwatch.stop()
### bench.timestamp(thing, where)
Function to add something a timestamp from somewhere.
### bench.summary()
