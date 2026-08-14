"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _formDeleteButton = _interopRequireDefault(require("./form-delete-button"));
const getSavedEditor = editor => Array.isArray(editor) ? editor[0] : editor;
class FileUpload extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "canEditFiles", () => {
      const isReadOnly = !!(this.props.read_only || this.props.data && this.props.data.readOnly);
      return !isReadOnly;
    });
    (0, _defineProperty2.default)(this, "uploadAttachFile", async file => {
      if (typeof this.props.onUploadFile !== 'function') {
        console.log('FileUpload >>>>> not upload function found', this.props.onUploadFile);
        return;
      }
      console.log('Uploading file.....');
      const fileName = await this.props.onUploadFile(file);
      return {
        originalName: file.name,
        fileName
      };
    });
    (0, _defineProperty2.default)(this, "onUploadMultipleFiles", async event => {
      event.persist();
      if (!event || !event.target || !event.target.files) {
        return;
      }
      const newFileList = Array.from(event.target.files);
      const newResponse = [];
      for (let i = 0; i < newFileList.length; i = i + 1) {
        const currentFile = newFileList[i];
        const response = await this.uploadAttachFile(currentFile);
        if (response) {
          newResponse.push(response);
        }
      }
      this.setState(current => {
        return {
          fileList: [...current.fileList, ...newResponse]
        };
      });
    });
    (0, _defineProperty2.default)(this, "onDownloadFile", async file => {
      if (typeof this.props.onDownloadFile !== 'function') {
        console.log('FileUpload >>>>> no download function found', this.props.onDownloadFile);
        return;
      }
      console.log('Downloading File file.....');
      await this.props.onDownloadFile(file);
      console.log('download filtPath: ', file);
    });
    (0, _defineProperty2.default)(this, "onRemoveFile", file => {
      if (!this.canEditFiles()) {
        console.log('User not authorized to delete file');
        return;
      }
      this.setState(current => {
        const remainList = current.fileList.filter(item => item.fileName !== file.fileName);
        return {
          fileList: [...remainList]
        };
      });
    });
    this.inputField = /*#__PURE__*/_react.default.createRef(null);
    const fileList = props.defaultValue && props.defaultValue.fileList || [];
    this.state = {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: [...fileList]
    };
  }
  render() {
    const savedEditor = getSavedEditor(this.props.editor);
    const hasValue = this.state.fileList && this.state.fileList.length > 0;
    const canEdit = this.canEditFiles();
    const files = this.state.fileList ? this.state.fileList.map(f => f.originalName).join(', ') : '';
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(files, "\nEdited by: ").concat(savedEditor.name) : '';
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: this.tableRef,
      className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : ''),
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("input", {
      multiple: true,
      ref: this.inputField,
      type: "file",
      name: "fileUpload",
      title: " ",
      style: {
        display: 'none'
      },
      onChange: this.onUploadMultipleFiles,
      disabled: !canEdit
    }), /*#__PURE__*/_react.default.createElement("a", {
      href: "#",
      style: {
        marginTop: 6
      },
      className: "btn btn-secondary",
      onClick: e => {
        e.preventDefault();
        if (!canEdit) {
          return;
        }
        this.inputField && this.inputField.current.click();
      }
    }, "Upload files"), this.state.fileList && this.state.fileList.length > 0 && /*#__PURE__*/_react.default.createElement("ul", {
      style: {
        display: 'flex',
        maxWidth: '450px',
        flexDirection: 'column',
        marginTop: '1rem',
        paddingLeft: 0
      }
    }, this.state.fileList.map((file, index) => {
      return /*#__PURE__*/_react.default.createElement("li", {
        key: "file".concat(index),
        style: {
          listStyleType: 'none',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          width: '100%'
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          cursor: 'pointer',
          flex: 1,
          minWidth: 0
        },
        onClick: () => {
          this.onDownloadFile(file);
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          marginRight: 4
        }
      }, index + 1, "."), ' ', file.originalName), canEdit && /*#__PURE__*/_react.default.createElement(_formDeleteButton.default, {
        title: "Delete file",
        onClick: () => {
          this.onRemoveFile(file);
        }
      }));
    })))));
  }
}
(0, _defineProperty2.default)(FileUpload, "getDerivedStateFromProps", (props, state) => {
  console.log('FileUpload >> getDerivedStateFromProps');
  console.log(props.defaultValue);
  if (props.defaultValue && JSON.stringify(props.defaultValue.fileList) !== JSON.stringify(state.defaultValue)) {
    const fileList = props.defaultValue && props.defaultValue.fileList || [];
    return {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: [...fileList]
    };
  }
  return state;
});
var _default = exports.default = FileUpload;