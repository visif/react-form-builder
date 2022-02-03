import React from "react";
import ComponentHeader from "./component-header";

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    this.state = {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: [],
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log("FileUpload getDerivedStateFromProps");
    if (props.defaultValue !== state.defaultValue) {
      return {
        defaultValue: props.defaultValue && props.defaultValue.isSigned,
      };
    }

    return state;
  };

  onRemoveFile = (file) => {
    this.setState((current) => {
      const remainList = current.fileList.filter((item) => item.id !== file.id);
      return {
        fileList: [...remainList],
      };
    });
  };

  uploadAttachFile = async (file) => {
    if (typeof this.props.onUploadFile !== "function") {
      return;
    }

    const fileName = this.props.onUploadFile(file);
    return {
      originalName: file.name,
      fileName,
    };
  };

  onUploadMultipleFiles = async (event) => {
    if (!event || !event.target || !event.target.files) {
      return;
    }

    const newFileList = Array.from(event.target.files);

    for (let i = 0; i < newFileList.length; i = i + 1) {
      debugger;
      const currentFile = newFileList[i];
      const response = await this.uploadAttachFile(currentFile);
      if (response) {
        this.setState((current) => {
          return {
            fileList: [...current.fileList, response],
          };
        });
      }
    }
  };

  render() {
    return (
      <div
        ref={this.tableRef}
        className={`SortableItem rfb-item${
          this.props.data.pageBreakBefore ? " alwaysbreak" : ""
        }`}
      >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <div>
            <input
              type="file"
              name="fileUpload"
              multiple
              style={{ marginTop: 6 }}
              onChange={this.onUploadMultipleFiles}
            />
            {this.state.fileList && this.state.fileList.length && (
              <ul
                style={{
                  display: "flex",
                  maxWidth: "400px",
                  flexDirection: "column",
                  marginTop: "1rem",
                }}
              >
                {this.state.fileList.map((file, index) => {
                  return (
                    <li
                      key={`file${index}`}
                      style={{
                        listStyleType: "none",
                        fontSize: 16,
                        display: "block",
                      }}
                    >
                      <span style={{ float: "left" }}>
                        <span style={{ marginRight: 4 }}>{index + 1}.</span>{" "}
                        {file.fileName}
                      </span>
                      <span
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={() => {
                          this.onRemoveFile(file);
                        }}
                      >
                        <i class="fas fa-trash"></i>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FileUpload;
