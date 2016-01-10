// Ayasdi Inc. Copyright 2014
// Color.js may be freely distributed under the Apache 2.0 license

/**
  * Color.js
  * ========
  * Color helper.
  *
  * Colors parsed by this helper will be in the format:
  * [r, g, b, a]
  * where each color attribute is a value between 0-255.
  */

module.exports = {
  interpolate: interpolate
};

function interpolate (a, b, amt) {
  amt = amt === undefined ? 0.5 : amt;
  var interpolated = a.map(function (colorA, index) {
    var colorB = b[index];
    return colorA + (colorB - colorA) * amt;
  });
  return interpolated;
}
