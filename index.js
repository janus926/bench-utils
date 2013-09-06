function hrtimeStr(hrtime) {
    var h;
    var m;
    var s = hrtime[0];
    var ms;
    var ns = hrtime[1];
    if (s) {
        h = Math.floor(s / 3600);
        s %= 3600;
        m = Math.floor(s / 60);
        s %= 60;
    }
    ms = ns / 1e6;
    return (h ? h + 'h' : '') + (m ? m + 'm' : '') + (s ? s + 's' : '') +
           ms + 'ms';
}

function hrtimeCompare(a, b) {
    var a0 = a[0];
    var b0 = b[0];
    if (a0 < b0)
        return -1;
    if (a0 > b0)
        return 1;
    var a1 = a[1];
    var b1 = b[1];
    if (a1 < b1)
        return -1;
    if (a1 > b1)
        return 1;
    return 0;
}

function hrtimeAdd(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    if (a[1] > 1e9) {
        a[0] += 1;
        a[1] -= 1e9;
    }
    return a;
}

function hrtimeSub(a, b) {
    // Assume a >= b
    a[0] -= b[0];
    a[1] -= b[1];
    if (a[1] < 0) {
        a[0] -= 1;
        a[1] += 1e9;
    }
    return a;
}

function hrtimeDiv(a, b) {
    var result = [Math.floor(a[0] / b),
                  Math.floor((a[0] % b * 1e9 + a[1]) / b)];
    return hrtimeStr(result);
}

var benchUtils = {

    stopwatches: {},
    timestamps: {},

    Stopwatch: function (id) {
        this.cycles = 0;
        this.elapsed = [0, 0];
        this.startTime = null;
        benchUtils.stopwatches[id] = this;
    },

    Timestamp: function (objId, where) {
        if (!benchUtils.timestamps[objId])
            benchUtils.timestamps[objId] = {};
        benchUtils.timestamps[objId][where] = process.hrtime();
    },

    report: function () {
        console.log('-- stopwatch --');
        var sw;
        for (var id in benchUtils.stopwatches) {
            sw = benchUtils.stopwatches[id];
            console.log(id,
                        '- cycles=' + sw.cycles +
                        ', elpased=' + hrtimeStr(sw.elapsed) +
                        ', avg=' + hrtimeDiv(sw.elapsed, sw.cycles));
        }

        console.log('-- timestamp --');
        for (var objId in benchUtils.timestamps) {
            var array = [];
            for (var ts in benchUtils.timestamps[objId])
                array.push([ts, benchUtils.timestamps[objId][ts]])
            array.sort(hrtimeCompare);
            process.stdout.write(objId + ' - ' + array[0][0]);
            for (var i = 1; i < array.length; ++i)
                process.stdout.write('+' + hrtimeStr(hrtimeSub(array[i][1], array[i - 1][1])) +
                                     ' > ' + array[i][0]);
            process.stdout.write('\n');
        }
    }
};

benchUtils.Stopwatch.prototype.start = function () {
    if (!this.startTime)
        this.startTime = process.hrtime();
};

benchUtils.Stopwatch.prototype.stop = function () {
    if (this.startTime) {
        var now = process.hrtime();
        hrtimeAdd(this.elapsed, hrtimeSub(now, this.startTime));
        ++this.cycles;
        this.startTime = null;
    }
};

module.exports = benchUtils;
