import React from "react";
import ComponentHeader from "./component-header";

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    const fileList = (props.defaultValue && props.defaultValue.fileList) || [];

    this.state = {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: [...fileList],
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log("FileUpload >> getDerivedStateFromProps");
    console.log(props.defaultValue);
    if (props.defaultValue !== state.defaultValue) {
      const fileList =
        (props.defaultValue && props.defaultValue.fileList) || [];
      return {
        defaultValue: props.defaultValue && props.defaultValue.fileList,
        fileList: [...fileList],
      };
    }

    return state;
  };

  onRemoveFile = (file) => {
    this.setState((current) => {
      const remainList = current.fileList.filter(
        (item) => item.fileName !== file.fileName
      );
      return {
        fileList: [...remainList],
      };
    });
  };

  uploadAttachFile = async (file) => {
    if (typeof this.props.onUploadFile !== "function") {
      console.log(
        "FileUpload >>>>> not upload function found",
        this.props.onUploadFile
      );
      return;
    }

    console.log("Uploading file.....");
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
                  maxWidth: "450px",
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
                        style={{
                          float: "right",
                          cursor: "pointer",
                          marginTop: 4,
                        }}
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
