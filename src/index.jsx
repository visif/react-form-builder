/**
 * <ReactFormBuilder />
 */

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Preview from "./preview";
import Toolbar from "./toolbar";
import ReactFormGenerator from "./form";
import store from "./stores/store";
import Registry from "./stores/registry";

// import React, { createContext, useReducer, useContext } from "react";

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

const ReactFormBuilder = (props) => {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     editMode: false,
  //     editElement: null,
  //   };
  //   this.editModeOn = this.editModeOn.bind(this);
  // }

  // editModeOn(data, e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (this.state.editMode) {
  //     this.setState({ editMode: !this.state.editMode, editElement: null });
  //   } else {
  //     this.setState({ editMode: !this.state.editMode, editElement: data });
  //   }
  // }

  // manualEditModeOff() {
  //   if (this.state.editMode) {
  //     this.setState({
  //       editMode: false,
  //       editElement: null,
  //     });
  //   }
  // }

  // render() {
  const toolbarProps = {
    showDescription: props.show_description,
  };
  if (props.toolbarItems) {
    toolbarProps.items = props.toolbarItems;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <FormProvider>
        <div>
          <div className="react-form-builder clearfix">
            <div>
              {/* <Preview
                files={this.props.files}
                manualEditModeOff={this.manualEditModeOff.bind(this)}
                showCorrectColumn={this.props.showCorrectColumn}
                parent={this}
                data={this.props.data}
                url={this.props.url}
                saveUrl={this.props.saveUrl}
                onLoad={this.props.onLoad}
                onPost={this.props.onPost}
                editModeOn={this.editModeOn}
                editMode={this.state.editMode}
                variables={this.props.variables}
                registry={Registry}
                editElement={this.state.editElement}
                renderEditForm={this.props.renderEditForm}
                onChange={this.props.onChange}
                uploadUrl={this.props.uploadUrl}
                onImageUpload={this.props.onImageUpload}
                getDataSource={this.props.getDataSource}
                getFormSource={this.props.getFormSource}
                getFormContent={this.props.getFormContent}
                getActiveUserProperties={() => {
                  return {
                    name: "test",
                    userId: "id001",
                  };
                }}
                onUploadFile={(file) => {
                  return `${file.name}-${Math.random() * 10000000}`;
                }}
                onUploadImage={(file) => {
                  return `path/${file.name}-${Math.random() * 10000000}`;
                }}
                onDownloadFile={(file) => {
                  return `download_${file.name}-${Math.random() * 10000000}`;
                }}
              /> */}
              <Toolbar
                {...toolbarProps}
                customItems={props.customToolbarItems}
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </DndProvider>
  );
  // }
};

const FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
FormBuilders.ReactFormGenerator = ReactFormGenerator;
FormBuilders.ElementStore = store;
FormBuilders.Registry = Registry;

export default FormBuilders;

export {
  ReactFormBuilder,
  ReactFormGenerator,
  store as ElementStore,
  Registry,
};
