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

class ReactFormBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editElement: null,
    };
    this.editModeOn = this.editModeOn.bind(this);
  }

  editModeOn(data, e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.editMode) {
      this.setState({ editMode: !this.state.editMode, editElement: null });
    } else {
      this.setState({ editMode: !this.state.editMode, editElement: data });
    }
  }

  manualEditModeOff() {
    if (this.state.editMode) {
      this.setState({
        editMode: false,
        editElement: null,
      });
    }
  }

  // onPost () {
  //   if (typeof this.props.onPost === 'function') {
  //     this.props.onPost(data)
  //   }
  // }

  render() {
    const toolbarProps = {
      showDescription: this.props.show_description,
    };
    if (this.props.toolbarItems) {
      toolbarProps.items = this.props.toolbarItems;
    }
    return (
      <DndProvider backend={HTML5Backend}>
        <div>
          {/* <div>
           <p>
             It is easy to implement a sortable interface with React DnD. Just make
             the same component both a drag source and a drop target, and reorder
             the data in the <code>hover</code> handler.
           </p>
           <Container />
         </div> */}
          <div className="react-form-builder clearfix">
            <div>
              <Preview
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
                getActiveUserProperties={() => {
                  return {
                    name: "test",
                  };
                }}
                getDataSource={(sourceType) => {
                  if (sourceType === "name") {
                    return [
                      { id: 1, name: "NameA lastNameA" },
                      { id: 2, name: "NameB lastNameB" },
                    ];
                  }

                  if (sourceType === "department") {
                    return [
                      { id: 1, name: "departmentA" },
                      { id: 2, name: "departmentB" },
                    ];
                  }

                  if (sourceType === "role") {
                    return [
                      { id: 1, name: "roleA" },
                      { id: 2, name: "roleB" },
                    ];
                  }

                  if (sourceType === "form") {
                    return [
                      { id: 1, name: "formA" },
                      { id: 2, name: "formB" },
                    ];
                  }

                  return [];
                }}
                getFormSource={() => {
                  return [
                    { id: 1, name: "Form A", columns: ["columnA", "columnB"] },
                    { id: 2, name: "Form B", columns: ["column1", "column2"] },
                  ];
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
              />
              <Toolbar
                {...toolbarProps}
                customItems={this.props.customToolbarItems}
              />
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
}

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
