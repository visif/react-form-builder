import React from "react";
import ComponentHeader from "./component-header";
import noImage from "./noImage.png";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef(null);

    const filePath = props.defaultValue && props.defaultValue.filePath;

    this.state = {
      defaultValue: filePath,
      filePath: filePath,
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log("FileUpload >> getDerivedStateFromProps");
    console.log(props.defaultValue);
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.fileList) !==
        JSON.stringify(state.defaultValue)
    ) {
      const filePath = props.defaultValue && props.defaultValue.filePath;
      return {
        defaultValue: filePath,
        fileList: filePath,
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
    const fileName = await this.props.onUploadFile(file);
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
          <div style={{ position: "relative" }}>
            <img
              style={{ width: 200 }}
              // src="https://media.istockphoto.com/vectors/cute-panda-character-vector-design-vector-id1195743934"
              src={this.state.filePath ? this.state.filePath : noImage}
            />
          </div>
          <div>
            <input
              ref={this.inputField}
              type="file"
              name="fileUpload"
              title=" "
              style={{ display: "none" }}
              onChange={this.onUploadMultipleFiles}
            />
            <a
              href=""
              className="btn btn-secondary"
              onClick={(e) => {
                this.inputField && this.inputField.current.click();
                e.preventDefault();
              }}
            >
              Upload Image
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageUpload;
