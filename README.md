# bench-utils

# Usage
```javascript
// Counter
var counter = new bench.Counter('forLoopCounter');
counter.start();
for (var i = 0; i < 100; ++i) {
  counter.incr();
}
counter.stop();
console.log(counter.toString()); // [counter forLoopCounter value=100 elapsed=0.049861ms]

// Stopwatch
var stopwatch = new bench.Stopwatch('forLoopDuration');
stopwatch.start();
for (var i = 0; i < 100; ++i)
  ;
stopwatch.stop();
console.log(stopwatch.toString()); // [stopwatch forLoopDuration cycles=1 elapsed=0.030586ms]

// Timestampable
var rpc = new bench.Timestampable('rpc');
rpc.timestamp('received');
rpc.timestamp('processed');
rpc.timestamp('replied');
console.log(rpc.toString()); // [timestampable rpc received=0ms processed=0.010993ms replied=0.013843ms]
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
## Counter(name)
### counter.decr([value])
### counter.incr([value])
Default value is 1.
### counter.start()
### counter.stop()
Use start/stop in case you want to record how long the counter is
couting. decr/incr still works even start is not called.
### counter.reset()
### counter.toString()
## Stopwatch(name)
### stopwatch.start()
### stopwatch.stop()
The stopwatch has cumulative elapsed time from each start/stop cycle.
### stopwatch.reset()
### stopwatch.toString()
## Timestampable(name)
### timestampable.timestamp(event)
### timestampable.reset()
### timestampable.toString()
The output list time differences from each event to the first one.
