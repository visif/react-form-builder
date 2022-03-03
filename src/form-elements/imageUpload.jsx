import React from "react";
import ComponentHeader from "./component-header";
import noImage from "./noImage.png";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef(null);

    const filePath = props.defaultValue && props.defaultValue.filePath;
    const fileName = props.defaultValue && props.defaultValue.fileName;

    this.state = {
      defaultValue: props.defaultValue,
      filePath: filePath,
      fileName: fileName,
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log("ImageUpload >> getDerivedStateFromProps");
    console.log(props.defaultValue);
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue) !== JSON.stringify(state.defaultValue)
    ) {
      const filePath = props.defaultValue && props.defaultValue.filePath;
      const fileName = props.defaultValue && props.defaultValue.fileName;

      return {
        defaultValue: props.defaultValue,
        filePath: filePath,
        fileName: fileName,
      };
    }

    return state;
  };

  onRemoveImage = () => {
    this.setState(() => {
      return {
        filePath: "",
        fileName: "",
      };
    });
  };

  uploadImageFile = async (event) => {
    event.persist();

    if (!event || !event.target || !event.target.files) {
      return;
    }

    const file = Array.from(event.target.files)[0];

    if (typeof this.props.onUploadImage !== "function") {
      console.log(
        "onUploadImage >>>>> no upload function found",
        this.props.onUploadImage
      );
      return;
    }

    console.log("Uploading image .....");
    const filePath = await this.props.onUploadImage(file);
    this.setState({
      fileName: file.name,
      filePath,
    });
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
            <div
              className="btn is-isolated"
              onClick={this.onRemoveImage}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                display: this.state.filePath ? "" : "none",
              }}
            >
              <i className="is-isolated fas fa-trash"></i>
            </div>
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
              onChange={this.uploadImageFile}
            />
            <a
              href=""
              className="btn btn-secondary"
              style={{ display: this.state.filePath ? "none" : "inline-block" }}
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
