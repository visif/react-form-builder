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
                getDataSource={this.props.getDataSource}
                getFormSource={this.props.getFormSource}
                getFormContent={this.props.getFormContent}
                getActiveUserProperties={() => {
                  return {
                    name: "test",
                    userId: "id001",
                  };
                }}
                // getDataSource={(data) => {
                //   if (data.sourceType === "name") {
                //     return [
                //       { id: 1, name: "NameA lastNameA" },
                //       { id: 2, name: "NameB lastNameB" },
                //     ];
                //   }

                //   if (data.sourceType === "department") {
                //     return [
                //       { id: 1, name: "departmentA" },
                //       { id: 2, name: "departmentB" },
                //     ];
                //   }

                //   if (data.sourceType === "role") {
                //     return [
                //       { id: 1, name: "roleA" },
                //       { id: 2, name: "roleB" },
                //     ];
                //   }

                //   if (data.sourceType === "form") {
                //     return [
                //       { id: 1, name: "formA" },
                //       { id: 2, name: "formB" },
                //     ];
                //   }

                //   return [];
                // }}
                // getFormSource={() => {
                //   return [
                //     { id: 1, name: "Form A", columns: ["columnA", "columnB"] },
                //     { id: 2, name: "Form B", columns: ["column1", "column2"] },
                //   ];
                // }}
                // getFormContent={() => {
                //   return {
                //     id: 1,
                //     name: "Form A",
                //     columns: [
                //       {
                //         element: "Dropdown",
                //         field_name:
                //           "dropdown_31939D9F-12B6-4B6C-8EE6-D78AE63285EB",
                //         id: "9238BFD5-B863-417B-AE8D-C351D508EB6C",
                //         label: "Department ",
                //         required: false,
                //         text: "เลือกจากรายการ",
                //       },
                //       {
                //         element: "TwoColumnRow",
                //         field_name:
                //           "two_col_row_03518784-A9D9-42DC-B101-E1AC6F3A8E7F",
                //         id: "28FA1B3C-DCA3-4014-B767-1C2ADB79BAC7",
                //         isContainer: true,
                //         required: false,
                //         text: "แบ่งสองคอลัมน์",
                //       },
                //       {
                //         element: "Table",
                //         field_name:
                //           "tables_1813ADB0-F4ED-4535-AAC8-590A3D59C30E",
                //         id: "86537F7A-2904-4CA6-92F9-FC0543120330",
                //         required: false,
                //         rowLabels: [],
                //         rows: 3,
                //         text: "ตาราง",
                //       },
                //       {
                //         element: "ImageUpload",
                //         field_name:
                //           "fileimage_91E0B712-B28C-4C47-A016-903B95FB6111",
                //         id: "AA5033CE-B1BD-43FB-94DB-4E9A1677C8BA",
                //         parentId: "28FA1B3C-DCA3-4014-B767-1C2ADB79BAC7",
                //         parentIndex: 4,
                //         required: false,
                //         text: "อัพโหลดภาพ",
                //       },
                //       {
                //         element: "TextInput",
                //         field_name:
                //           "text_input_DEC9A96A-0AF1-4A30-BB94-5CE4451452E4",
                //         id: "83385BAD-2C11-464A-9AA4-91341FEE5933",
                //         label: "Name ",
                //         parentId: "28FA1B3C-DCA3-4014-B767-1C2ADB79BAC7",
                //         parentIndex: 3,
                //         required: true,
                //         text: "กรอกบรรทัดเดียว",
                //       },
                //     ],
                //   };
                // }}
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
