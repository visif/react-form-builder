import { useState, useEffect } from "react";
import store from "../stores/store";

export const ACTION = {
  UNDO: "undo",
  REDO: "redo",
};

const useUndoRedo = () => {
  const [currentState, setCurrentState] = useState([]);
  const [history, setHistory] = useState([currentState]);
  const [index, setIndex] = useState(0);

  const updateState = (newState, action) => {
    let currentStateIndex = history.length;
    setHistory((currentHistory) => {
      currentStateIndex = currentHistory.length;
      return [...currentHistory, [...newState]];
    });
    setIndex(() => {
      return currentStateIndex;
    });
    setCurrentState(newState);
  };

  const undo = () => {
    if (index > 0) {
      setIndex(index - 1);
      setCurrentState(history[index - 1]);
      store.dispatch("load", {
        data: history[index - 1] || [],
        action: ACTION.UNDO,
      });
    }
  };

  const redo = () => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      setCurrentState(history[index + 1]);
      store.dispatch("load", {
        data: history[index + 1] || [],
        action: ACTION.REDO,
      });
    }
  };

  // Example: Listen for keyboard events
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [index, undo, redo]);

  return {
    index,
    currentState,
    history,
    updateState,
    undo,
    redo,
  };
};

export default useUndoRedo;
