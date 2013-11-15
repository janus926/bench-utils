# bench-utils

# Usage
```javascript
var bench = require('./index');

// Counter
var counter = new bench.Counter('loopCounter');
counter.start();
for (var i = 0; i < 100; ++i) {
  counter.incr();
}
counter.stop();

// Stopwatch
var stopwatch = new bench.Stopwatch('loopDuration');
stopwatch.start();
for (var i = 0; i < 100; ++i)
  ;
stopwatch.stop();

// Timestampable
var timestampable = new bench.Timestampable('rpcN');
timestampable.timestamp('received');
timestampable.timestamp('processed');
timestampable.timestamp('replied');

bench.print();
```
Output:
```
[C loopCounter value=100 elapsed=0.102041ms]
[S loopDuration cycles=1 elapsed=0.056351ms]
[T rpcN received=0ms processed=0.02386ms replied=0.028968ms]
```

# API
## bench.counters
## bench.stopwatches
## bench.timestampables
Use the instances collection to ease your application from passing
them around.
```javascript
bench.counters.forLoopCounter.incr();
bench.counters['forLoopCounter'].incr();
```
## bench.print([regexp])
Output the matched instances `toString` to console.
## Counter(name)
### counter.decr([value])
### counter.incr([value])
Default value is 1.
### counter.start()
### counter.stop()
Use `start`/`stop` in case you want to record how long the counter is
couting. `decr`/`incr` still works even start is not called.
### counter.reset()
### counter.toString()
## Stopwatch(name)
### stopwatch.start()
### stopwatch.stop()
The stopwatch has cumulative elapsed time from each `start`/`stop` cycle.
### stopwatch.reset()
### stopwatch.toString()
## Timestampable(name)
### timestampable.timestamp(event)
### timestampable.reset()
### timestampable.toString()
The output list time differences from each event to the first one.
