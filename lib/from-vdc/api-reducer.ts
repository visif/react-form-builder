import { ApiActions, ApiState } from "../types/api-client";

const initialState = {
  isLoading: true,
  isError: false,
  data: null
};

const reducer = <T>(state: ApiState<T> = initialState, action: ApiActions<T>): ApiState<T> => {
  switch (action.type) {
    case "INIT": {
      return { ...state, isLoading: initialState.isLoading, isError: initialState.isError };
    }
    case "SUCCESS": {
      return { ...state, isLoading: false, isError: false, data: action.payload };
    }
    case "FAILURE": {
      const payload = action.payload;
      const newState = { ...state, isLoading: false, isError: true };
      return payload ? { ...newState, data: payload } : newState;
    }
    case "RESET": {
      return { ...state, data: null, isLoading: false, isError: false };
    }
    default:
      return state;
  }
};

export default {
  reducer,
  initialState
};
