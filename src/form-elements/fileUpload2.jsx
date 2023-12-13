import React, { useRef, useState } from "react";
import ComponentHeader from "./component-header";
import { useFormContext, FORM_ACTION } from "../context/form-context";

const FileUpload = (props) => {
  const { dispatch } = useFormContext();
  const inputField = useRef(null);
  const tableRef = useRef(null);

  const [fileList, setFileList] = useState(
    (props.defaultValue && props.defaultValue.fileList) || []
  );

  const onRemoveFile = (file) => {
    const remainList = fileList.filter(
      (item) => item.fileName !== file.fileName
    );
    dispatch({
      type: FORM_ACTION.UPDATE_VALUE,
      name: props.data.field_name,
      value: [...remainList],
    });
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
