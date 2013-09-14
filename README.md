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
- COUNTER -
NAME     VALUE ELAPSED        TIMES/SEC      
loop1     1000 3.326262ms     300637.772972  
- STOPWATCH -
NAME    CYCLES ELAPSED        CYCLE TIME     SPLITS ELAPSED        SPLIT TIME   
for1         1 3.334602ms     3.334602ms       1000 3.268793ms     0.003268ms   
block1    1000 0.476952ms     0.000476ms          0 0ms            NaNms        
- TIMESTAMPABLE -
NAME    EVENT        DIFF           CUMULATIVE     
rpc1    received     -              0ms            
        processed    0.014056ms     0.014056ms     
        replied      3.455259ms     3.469315ms     
```

## API
### bench.counters
### bench.stopwaches
### bench.timestampables
Use the instances collection to ease your application from passing them around.
### bench.summary([regexp])
### Counter(name)
#### counter.decr([value])
#### counter.incr([value])
#### counter.start()
#### counter.stop()
### Stopwatch(name)
#### stopwatch.split()
#### stopwatch.start()
#### stopwatch.stop()
### Timestampable(name)
#### timestampable.timestamp(event)
