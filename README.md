bench-utils
===========

StopWatch
-----------
```
var sw = new bench.Stopwatch('loop0');
var dummy = 0;

for (var i = 0; i < 10000; ++i) {
    sw.start();
    dummy += i * 2;
    sw.stop();
}
```

Timestamp
-----------
```
new bench.Timestamp('rpc0', 'station1');
new bench.Timestamp('rpc0', 'station2');

...

new bench.Timestamp('rpc0', 'station3');
```

report()
-----------
>-- stopwatch --
loop0 - cycles=10000, elpased=14.29784ms, avg=0.001429ms
-- timestamp --
rpc0 - station1+0.034642ms > station2+31.690728ms > station3
