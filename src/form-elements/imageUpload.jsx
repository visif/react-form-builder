import React, { useState, useRef, useEffect } from "react";
import ComponentHeader from "./component-header";
// import noImage from "./noImage.png";

// class ImageUpload extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef(null);

//     const filePath = props.defaultValue && props.defaultValue.filePath;
//     const fileName = props.defaultValue && props.defaultValue.fileName;
//     const blobUrl = props.defaultValue && props.defaultValue.blobUrl;

//     this.state = {
//       defaultValue: props.defaultValue,
//       filePath,
//       fileName,
//       blobUrl,
//     };
//   }

//   static getDerivedStateFromProps = (props, state) => {
//     console.log("ImageUpload >> getDerivedStateFromProps");
//     console.log(props.defaultValue);
//     if (
//       props.defaultValue &&
//       JSON.stringify(props.defaultValue) !== JSON.stringify(state.defaultValue)
//     ) {
//       const filePath = props.defaultValue && props.defaultValue.filePath;
//       const fileName = props.defaultValue && props.defaultValue.fileName;
//       const blobUrl = props.defaultValue && props.defaultValue.blobUrl;

//       return {
//         defaultValue: props.defaultValue,
//         filePath,
//         fileName,
//         blobUrl,
//       };
//     }

//     return state;
//   };

//   onRemoveImage = () => {
//     if (!confirm("Confirm delete?")) {
//       return;
//     }

//     this.setState(() => {
//       return {
//         filePath: "",
//         fileName: "",
//         blobUrl: "",
//       };
//     });
//   };

//   uploadImageFile = async (event) => {
//     event.persist();

//     if (!event || !event.target || !event.target.files) {
//       return;
//     }

//     const file = Array.from(event.target.files)[0];

//     if (typeof this.props.onUploadImage !== "function") {
//       console.log(
//         "onUploadImage >>>>> no upload function found",
//         this.props.onUploadImage
//       );
//       return;
//     }

//     console.log("Uploading image .....");
//     const extension = `${file.name}`.substring(file.name.lastIndexOf("."));
//     const filePath = await this.props.onUploadImage(file);

//     const blobUrl = URL.createObjectURL(file);

//     this.setState({
//       fileName: file.name,
//       blobUrl,
//       filePath: `${filePath}${extension}`,
//     });
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     return (
//       <div
//         ref={this.tableRef}
//         className={`SortableItem rfb-item${
//           this.props.data.pageBreakBefore ? " alwaysbreak" : ""
//         }`}
//       >
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <div style={{ position: "relative" }}>
//             <div
//               className="btn is-isolated"
//               onClick={this.onRemoveImage}
//               style={{
//                 position: "absolute",
//                 left: 0,
//                 right: 0,
//                 display: this.state.filePath ? "" : "none",
//               }}
//             >
//               <i className="is-isolated fas fa-trash"></i>
//             </div>
//             <img
//               style={{ width: "70vw" }}
//               src={
//                 this.state.blobUrl || this.state.filePath
//                   ? this.state.blobUrl || this.state.filePath
//                   : ""
//               }
//             />
//           </div>
//           <div>
//             <input
//               ref={this.inputField}
//               type="file"
//               name="fileUpload"
//               title=" "
//               style={{ display: "none" }}
//               onChange={this.uploadImageFile}
//             />
//             <a
//               href=""
//               className="btn btn-secondary"
//               style={{
//                 display: this.state.filePath ? "none" : "inline-block",
//                 pointerEvents: isSameEditor ? "auto" : "none",
//               }}
//               onClick={(e) => {
//                 this.inputField && this.inputField.current.click();
//                 e.preventDefault();
//               }}
//             >
//               Upload Image
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default ImageUpload;

const ImageUpload = (props) => {
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [blobUrl, setBlobUrl] = useState("");
  const inputFieldRef = useRef(null);

  useEffect(() => {
    const defaultValue = props.defaultValue || {};
    setFilePath(defaultValue.filePath || "");
    setFileName(defaultValue.fileName || "");
    setBlobUrl(defaultValue.blobUrl || "");
  }, [props.defaultValue]);

  const onRemoveImage = () => {
    if (!confirm("Confirm delete?")) {
      return;
    }

    setFilePath("");
    setFileName("");
    setBlobUrl("");
  };

  const uploadImageFile = async (event) => {
    event.persist();

    if (!event || !event.target || !event.target.files) {
      return;
    }

    const file = Array.from(event.target.files)[0];

    if (typeof props.onUploadImage !== "function") {
      console.log(
        "onUploadImage >>>>> no upload function found",
        props.onUploadImage
      );
      return;
    }

    console.log("Uploading image .....");
    const extension = `${file.name}`.substring(file.name.lastIndexOf("."));
    const filePath = await props.onUploadImage(file);

    const blobUrl = URL.createObjectURL(file);

    setFileName(file.name);
    setBlobUrl(blobUrl);
    setFilePath(`${filePath}${extension}`);
  };

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  return (
    <div
      // ref={tableRef}
      className={`SortableItem rfb-item${
        props.data.pageBreakBefore ? " alwaysbreak" : ""
      }`}
    >
      <ComponentHeader {...props} />
      <div className="form-group">
        <div style={{ position: "relative" }}>
          <div
            className="btn is-isolated"
            onClick={onRemoveImage}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              display: filePath ? "" : "none",
            }}
          >
            <i className="is-isolated fas fa-trash"></i>
          </div>
          <img
            style={{ width: "70vw" }}
            src={blobUrl || filePath ? blobUrl || filePath : ""}
          />
        </div>
        <div>
          <input
            ref={inputFieldRef}
            type="file"
            name="fileUpload"
            title=" "
            style={{ display: "none" }}
            onChange={uploadImageFile}
          />
          <a
            href=""
            className="btn btn-secondary"
            style={{
              display: filePath ? "none" : "inline-block",
              pointerEvents: isSameEditor ? "auto" : "none",
            }}
            onClick={(e) => {
              inputFieldRef && inputFieldRef.current.click();
              e.preventDefault();
            }}
          >
            Upload Image
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
