"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/* eslint-disable */
// Private array of chars to use
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
var uuid = function uuid(len, radix) {
  var chars = CHARS;
  var uuid = [];
  var i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
var uuidFast = function uuidFast() {
  var chars = CHARS;
  var uuid = new Array(36);
  var rnd = 0;
  var r;
  for (var i = 0; i < 36; i++) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      uuid[i] = '-';
    } else if (i == 14) {
      uuid[i] = '4';
    } else {
      if (rnd <= 0x02) rnd = 0x2000000 + Math.random() * 0x1000000 | 0;
      r = rnd & 0xf;
      rnd = rnd >> 4;
      uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
    }
  }
  return uuid.join('');
};

// A more compact, but less performant, RFC4122v4 solution:
var uuidCompact = function uuidCompact() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};
var ID = {
  uuid: uuid,
  uuidFast: uuidFast,
  uuidCompact: uuidCompact
};
var _default = exports["default"] = ID;