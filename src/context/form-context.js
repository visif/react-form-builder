// import React, { createContext, useReducer, useContext } from "react";
import React from "react";

// const FormContext = createContext({
//   formValues: {},
// });

export const FORM_ACTION = {
  UPDATE_VALUE: "UPDATE_VALUE",
};

// const formReducer = (state, action) => {
//   switch (action.type) {
//     case FORM_ACTION.UPDATE_VALUE:
//       return {
//         ...state,
//         [action.name]: action.value,
//       };
//     default:
//       return state;
//   }
// };

// export const FormProvider = ({ children }) => {
//   const [formValues, dispatch] = useReducer(formReducer, {});

//   return (
//     <FormContext.Provider value={{ formValues, dispatch }}>
//       {children}
//     </FormContext.Provider>
//   );
// };

// export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  return <div>{children}</div>;
};
export const useFormContext = () => {};
