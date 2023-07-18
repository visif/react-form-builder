import React, { useRef, useState } from "react";
import ComponentHeader from "./component-header";
import { useFormContext, FORM_ACTION } from "../context/form-context";

// class FileUpload extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef(null);

//     const fileList = (props.defaultValue && props.defaultValue.fileList) || [];

//     this.state = {
//       defaultValue: props.defaultValue && props.defaultValue.fileList,
//       fileList: [...fileList],
//     };
//   }

//   static getDerivedStateFromProps = (props, state) => {
//     console.log("FileUpload >> getDerivedStateFromProps");
//     console.log(props.defaultValue);
//     if (
//       props.defaultValue &&
//       JSON.stringify(props.defaultValue.fileList) !==
//       JSON.stringify(state.defaultValue)
//     ) {
//       const fileList =
//         (props.defaultValue && props.defaultValue.fileList) || [];
//       return {
//         defaultValue: props.defaultValue && props.defaultValue.fileList,
//         fileList: [...fileList],
//       };
//     }

//     return state;
//   };

//   onRemoveFile = (file) => {
//     this.setState((current) => {
//       const remainList = current.fileList.filter(
//         (item) => item.fileName !== file.fileName
//       );
//       return {
//         fileList: [...remainList],
//       };
//     });
//   };

//   uploadAttachFile = async (file) => {
//     if (typeof this.props.onUploadFile !== "function") {
//       console.log(
//         "FileUpload >>>>> not upload function found",
//         this.props.onUploadFile
//       );
//       return;
//     }

//     console.log("Uploading file.....");
//     const fileName = await this.props.onUploadFile(file);
//     return {
//       originalName: file.name,
//       fileName,
//     };
//   };

//   onUploadMultipleFiles = async (event) => {
//     event.persist();

//     if (!event || !event.target || !event.target.files) {
//       return;
//     }

//     const newFileList = Array.from(event.target.files);
//     const newResponse = [];
//     for (let i = 0; i < newFileList.length; i = i + 1) {
//       const currentFile = newFileList[i];
//       const response = await this.uploadAttachFile(currentFile);
//       if (response) {
//         newResponse.push(response);
//       }
//     }

//     this.setState((current) => {
//       return {
//         fileList: [...current.fileList, ...newResponse],
//       };
//     });
//   };

//   onDownloadFile = async (file) => {
//     if (typeof this.props.onDownloadFile !== "function") {
//       console.log(
//         "FileUpload >>>>> no download function found",
//         this.props.onDownloadFile
//       );
//       return;
//     }

//     console.log("Downloading File file.....");
//     await this.props.onDownloadFile(file);
//     console.log("download filtPath: ", file);

//     if (!isSameEditor) {
//       props.disabled = "disabled";
//     }
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
//         className={`SortableItem rfb-item${this.props.data.pageBreakBefore ? " alwaysbreak" : ""
//           }`}
//       >
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <div>
//             <input
//               multiple
//               ref={this.inputField}
//               type="file"
//               name="fileUpload"
//               title=" "
//               style={{ display: "none" }}
//               onChange={this.onUploadMultipleFiles}
//               disabled={!isSameEditor}
//             />
//             <a
//               href="#"
//               style={{ marginTop: 6 }}
//               className="btn btn-secondary"
//               onClick={(e) => {
//                 e.preventDefault();
//                 this.inputField && this.inputField.current.click();
//               }}
//             >
//               Upload files
//             </a>
//             {this.state.fileList && this.state.fileList.length > 0 && (
//               <ul
//                 style={{
//                   display: "flex",
//                   maxWidth: "450px",
//                   flexDirection: "column",
//                   marginTop: "1rem",
//                 }}
//               >
//                 {this.state.fileList.map((file, index) => {
//                   return (
//                     <li
//                       key={`file${index}`}
//                       style={{
//                         listStyleType: "none",
//                         fontSize: 16,
//                         display: "block",
//                       }}
//                     >
//                       <span
//                         style={{ float: "left", cursor: "pointer" }}
//                         onClick={() => {
//                           this.onDownloadFile(file);
//                         }}
//                       >
//                         <span style={{ marginRight: 4 }}>{index + 1}.</span>{" "}
//                         {file.originalName}
//                       </span>
//                       <span
//                         style={{
//                           float: "right",
//                           cursor: "pointer",
//                           marginTop: 4
//                         }}
//                         onClick={() => {
//                           this.onRemoveFile(file);
//                         }}
//                       >
//                         <i className="fas fa-trash"></i>
//                       </span>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

const FileUpload = (props) => {
  const { dispatch } = useFormContext();
  const inputField = useRef(null);
  const tableRef = useRef(null);

  const [fileList, setFileList] = useState(
    (props.defaultValue && props.defaultValue.fileList) || []
  );
  const [defaultValue, setDefaultValue] = useState(
    props.defaultValue && props.defaultValue.fileList
  );

  const onRemoveFile = (file) => {
    const remainList = fileList.filter(
      (item) => item.fileName !== file.fileName
    );
    setFileList([...remainList]);
  };

  const uploadAttachFile = async (file) => {
    if (typeof props.onUploadFile !== "function") {
      console.log(
        "FileUpload >>>>> not upload function found",
        props.onUploadFile
      );
      return;
    }

    const fileName = await props.onUploadFile(file);
    return {
      originalName: file.name,
      fileName,
    };
  };

  const onUploadMultipleFiles = async (event) => {
    event.persist();

    if (!event || !event.target || !event.target.files) {
      return;
    }

    const newFileList = Array.from(event.target.files);
    const newResponse = [];
    for (let i = 0; i < newFileList.length; i = i + 1) {
      const currentFile = newFileList[i];
      const response = await uploadAttachFile(currentFile);
      if (response) {
        newResponse.push(response);
      }
    }

    dispatch({
      type: FORM_ACTION.UPDATE_VALUE,
      name: props.data.field_name,
      value: [...fileList, ...newResponse],
    });
    setFileList([...fileList, ...newResponse]);
  };

  const onDownloadFile = async (file) => {
    if (typeof props.onDownloadFile !== "function") {
      console.log(
        "FileUpload >>>>> no download function found",
        props.onDownloadFile
      );
      return;
    }

    await props.onDownloadFile(file);

    if (!isSameEditor) {
      props.disabled = "disabled";
    }
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
      ref={tableRef}
      className={`SortableItem rfb-item${
        props.data.pageBreakBefore ? " alwaysbreak" : ""
      }`}
    >
      <ComponentHeader {...props} />
      <div className="form-group">
        <div>
          <input
            multiple
            ref={inputField}
            type="file"
            name="fileUpload"
            title=" "
            style={{ display: "none" }}
            onChange={onUploadMultipleFiles}
            disabled={!isSameEditor}
          />
          <a
            href="#"
            style={{ marginTop: 6 }}
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              inputField && inputField.current.click();
            }}
          >
            Upload files
          </a>
          {fileList && fileList.length > 0 && (
            <ul
              style={{
                display: "flex",
                maxWidth: "450px",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              {fileList.map((file, index) => {
                return (
                  <li
                    key={`file${index}`}
                    style={{
                      listStyleType: "none",
                      fontSize: 16,
                      display: "block",
                    }}
                  >
                    <span
                      style={{ float: "left", cursor: "pointer" }}
                      onClick={() => {
                        onDownloadFile(file);
                      }}
                    >
                      <span style={{ marginRight: 4 }}>{index + 1}.</span>{" "}
                      {file.originalName}
                    </span>
                    <span
                      style={{
                        float: "right",
                        cursor: "pointer",
                        marginTop: 4,
                      }}
                      onClick={() => {
                        onRemoveFile(file);
                      }}
                    >
                      <i className="fas fa-trash"></i>
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
};

export default FileUpload;
