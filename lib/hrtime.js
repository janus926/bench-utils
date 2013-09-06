var hrtime = {

    str: function (hrtime) {
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
    },

    compare: function (a, b) {
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
    },

    add: function(a, b) {
	var result = [a[0] + b[0], a[1] + b[1]];
	if (result[1] > 1e9) {
            result[0] += 1;
            result[1] -= 1e9;
	}
	return result;
    },

    sub: function(a, b) {
	// Assume a >= b
	var result = [a[0] - b[0], a[1] - b[1]];
	if (result[1] < 0) {
            result[0] -= 1;
            result[1] += 1e9;
	}
	return result;
    },

    div: function(a, b) {
	return [Math.floor(a[0] / b),
		Math.floor((a[0] % b * 1e9 + a[1]) / b)];
    }
}

module.exports = hrtime;
