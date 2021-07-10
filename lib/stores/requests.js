"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.post = post;
exports.get = get;

var _isomorphicFetch = _interopRequireDefault(require("isomorphic-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  OPTIONS: ''
};

function post(url, data) {
  return (0, _isomorphicFetch["default"])(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  }).then(function (response) {
    return response;
  });
}

function get(url) {
  return (0, _isomorphicFetch["default"])(url, {
    method: 'GET',
    headers: headers
  }).then(function (response) {
    return response.json();
  });
}