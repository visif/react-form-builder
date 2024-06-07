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
        <div className="react-form-builder clearfix" style={{ height: "100%" }}>
          <div
            style={{
              display: "flex",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                margin: 8,
                padding: 8,
                zIndex: 1000,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  border: "1px dashed #ddd",
                  padding: 8,
                  marginRight: "4px",
                  backgroundColor: "#ffffff",
                }}
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "z",
                    ctrlKey: true,
                  });
                  document.dispatchEvent(event);
                }}
              >
                <i class="fas fa-history" />
              </span>
              <span
                style={{
                  border: "1px dashed #ddd",
                  padding: 8,
                  backgroundColor: "#ffffff",
                }}
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "y",
                    ctrlKey: true,
                  });
                  document.dispatchEvent(event);
                }}
              >
                <i className="fas fa-redo" />
              </span>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                height: "100%",
                scrollbarWidth: "none",
              }}
            >
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
              />
            </div>
            <div
              style={{
                width: "300px",
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                overflowY: "auto",
                position: "sticky",
                paddingLeft: "15px",
                height: "100%",
                scrollbarWidth: "none",
              }}
            >
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
