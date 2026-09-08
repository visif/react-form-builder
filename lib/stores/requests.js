"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.post = post;
var _isomorphicFetch = _interopRequireDefault(require("isomorphic-fetch"));
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  OPTIONS: ''
};
function post(url, data) {
  return (0, _isomorphicFetch.default)(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  }).then(response => response);
}
function get(url) {
  return (0, _isomorphicFetch.default)(url, {
    method: 'GET',
    headers
  }).then(response => response.json());
}