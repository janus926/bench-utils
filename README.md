# bench-utils

## Usage
```
var bench = require('./index');

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
  counter1 - value=1000, elapsed=3.211574ms, (311373.799888times/sec)
Stopwatch:
  stopwatch1 - cycles=1, total elapsed=3.225595ms (3.225595ms/cycle), splits=1000, splits elapsed=3.156403ms (0.003156ms/lap)
  stopwatch2 - cycles=1000, total elapsed=0.497903ms (0.000497ms/cycle)
Timestamp:
  rpc1 - station1 +0.020851ms > station2 +3.349915ms > station3
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
