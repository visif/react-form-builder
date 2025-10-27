"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ACTION = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _store = _interopRequireDefault(require("../stores/store"));
var ACTION = exports.ACTION = {
  UNDO: 'undo',
  REDO: 'redo'
};
var useUndoRedo = function useUndoRedo() {
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    currentState = _useState2[0],
    setCurrentState = _useState2[1];
  var _useState3 = (0, _react.useState)([currentState]),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    history = _useState4[0],
    setHistory = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    index = _useState6[0],
    setIndex = _useState6[1];
  var updateState = function updateState(newState, historyIndex) {
    var currentStateIndex = history.length;
    setHistory(function (currentHistory) {
      console.log('history index: ', historyIndex);
      var newHistory = currentHistory; //.slice(historyIndex + 1);
      currentStateIndex = newHistory.length;
      return [].concat((0, _toConsumableArray2["default"])(newHistory), [(0, _toConsumableArray2["default"])(newState)]);
    });
    setIndex(function () {
      return currentStateIndex;
    });
    setCurrentState(newState);
  };
  var undo = function undo() {
    if (index > 0) {
      setIndex(index - 1);
      setCurrentState(history[index - 1]);
      _store["default"].dispatch('update', {
        data: history[index - 1] || [],
        action: ACTION.UNDO
      });
    }
  };
  var redo = function redo() {
    if (index < history.length - 1) {
      setIndex(index + 1);
      setCurrentState(history[index + 1]);
      _store["default"].dispatch('update', {
        data: history[index + 1] || [],
        action: ACTION.REDO
      });
    }
  };

  // Example: Listen for keyboard events
  (0, _react.useEffect)(function () {
    var handleKeyPress = function handleKeyPress(event) {
      if (event.ctrlKey && event.key === 'z') {
        undo();
      } else if (event.ctrlKey && event.key === 'y') {
        redo();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return function () {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [index, undo, redo]);
  return {
    index: index,
    currentState: currentState,
    history: history,
    updateState: updateState,
    undo: undo,
    redo: redo
  };
};
var _default = exports["default"] = useUndoRedo;