"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ACTION = void 0;
var _react = require("react");
var _store = _interopRequireDefault(require("../stores/store"));
const ACTION = exports.ACTION = {
  UNDO: 'undo',
  REDO: 'redo'
};
const useUndoRedo = () => {
  const [currentState, setCurrentState] = (0, _react.useState)([]);
  const [history, setHistory] = (0, _react.useState)([currentState]);
  const [index, setIndex] = (0, _react.useState)(0);
  const updateState = (newState, historyIndex) => {
    let currentStateIndex = history.length;
    setHistory(currentHistory => {
      const newHistory = currentHistory;
      currentStateIndex = newHistory.length;
      return [...newHistory, [...newState]];
    });
    setIndex(() => currentStateIndex);
    setCurrentState(newState);
  };
  const undo = () => {
    if (index > 0) {
      setIndex(index - 1);
      setCurrentState(history[index - 1]);
      _store.default.dispatch('update', {
        data: history[index - 1] || [],
        action: ACTION.UNDO
      });
    }
  };
  const redo = () => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      setCurrentState(history[index + 1]);
      _store.default.dispatch('update', {
        data: history[index + 1] || [],
        action: ACTION.REDO
      });
    }
  };

  // Example: Listen for keyboard events
  (0, _react.useEffect)(() => {
    const handleKeyPress = event => {
      if (event.ctrlKey && event.key === 'z') {
        undo();
      } else if (event.ctrlKey && event.key === 'y') {
        redo();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [index, undo, redo]);
  return {
    index,
    currentState,
    history,
    updateState,
    undo,
    redo
  };
};
var _default = exports.default = useUndoRedo;