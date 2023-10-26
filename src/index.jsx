import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ReactFormBuilder = () => {
  return <DndProvider backend={HTML5Backend}>TESTTTTTTT</DndProvider>;
};

const FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;

export default FormBuilders;
