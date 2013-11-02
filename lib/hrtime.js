var hrtime = {
  str: function(hrtime) {
    var s = hrtime[0];
    var ns = hrtime[1];
    var result = new String();
    if (s) {
      var h;
      var m;
      h = Math.floor(s / 3600);
      s %= 3600;
      m = Math.floor(s / 60);
      s %= 60;
      result = h ? h + 'h' : m ? m + 'm' : s + 's';
    }
    return result + (ns / 1e6) + 'ms';
  },

  add: function(a, b) {
    if (!a)
      a = [0, 0];
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
