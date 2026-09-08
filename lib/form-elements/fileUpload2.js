"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactImageLightbox = _interopRequireDefault(require("react-image-lightbox"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _formDeleteButton = _interopRequireDefault(require("./form-delete-button"));
require("react-image-lightbox/style.css");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const getSavedEditor = editor => Array.isArray(editor) ? editor[0] : editor;
const isImageFileName = name => /\.(jpe?g|png|gif|webp|bmp)$/i.test("".concat(name || ''));
const filePreviewKey = file => file.fileName || file.originalName || '';
class FileUpload extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "canEditFiles", () => {
      const isReadOnly = !!(this.props.read_only || this.props.data && this.props.data.readOnly);
      return !isReadOnly;
    });
    (0, _defineProperty2.default)(this, "resolvePreviews", async () => {
      if (typeof this.props.resolveImageUrl !== 'function') {
        return;
      }
      const nextPreviews = {};
      for (const file of this.state.fileList || []) {
        const displayName = file.originalName || file.fileName;
        if (!isImageFileName(displayName) && !isImageFileName(file.fileName)) {
          continue;
        }
        const candidates = [file.fileName, file.originalName].filter(Boolean);
        let url = '';
        for (const candidate of candidates) {
          try {
            url = (await this.props.resolveImageUrl(candidate)) || '';
          } catch (_unused) {
            url = '';
          }
          if (url) {
            break;
          }
        }
        if (url) {
          nextPreviews[filePreviewKey(file)] = url;
        }
      }
      if (this.state.fileList) {
        this.setState({
          previews: nextPreviews
        });
      }
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
      const newPreviews = {};
      for (let i = 0; i < newFileList.length; i = i + 1) {
        const currentFile = newFileList[i];
        const response = await this.uploadAttachFile(currentFile);
        if (response) {
          newResponse.push(response);
          if (currentFile.type && currentFile.type.startsWith('image/')) {
            newPreviews[filePreviewKey(response)] = URL.createObjectURL(currentFile);
          }
        }
      }
      this.setState(current => {
        return {
          fileList: [...current.fileList, ...newResponse],
          previews: _objectSpread(_objectSpread({}, current.previews), newPreviews)
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
      fileList: [...fileList],
      previews: {},
      lightboxSrc: ''
    };
  }
  componentDidMount() {
    this.resolvePreviews();
  }
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.fileList !== this.state.fileList) {
      this.resolvePreviews();
    }
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
    }, "Upload files"), this.state.fileList && this.state.fileList.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12
      }
    }, this.state.fileList.map((file, index) => {
      const previewSrc = this.state.previews[filePreviewKey(file)];
      if (!previewSrc) {
        return null;
      }
      return /*#__PURE__*/_react.default.createElement("img", {
        key: "preview-".concat(index),
        src: previewSrc,
        alt: file.originalName || file.fileName,
        style: {
          width: 120,
          height: 120,
          objectFit: 'contain',
          cursor: 'pointer',
          border: '1px solid #d9d9d9',
          background: '#fafafa'
        },
        onClick: () => this.setState({
          lightboxSrc: previewSrc
        })
      });
    })), this.state.fileList && this.state.fileList.length > 0 && /*#__PURE__*/_react.default.createElement("ul", {
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
    })))), this.state.lightboxSrc && /*#__PURE__*/_react.default.createElement(_reactImageLightbox.default, {
      mainSrc: this.state.lightboxSrc,
      reactModalStyle: {
        overlay: {
          zIndex: 11000
        },
        content: {
          zIndex: 11000
        }
      },
      onCloseRequest: () => this.setState({
        lightboxSrc: ''
      })
    }));
  }
}
(0, _defineProperty2.default)(FileUpload, "getDerivedStateFromProps", (props, state) => {
  if (props.defaultValue && JSON.stringify(props.defaultValue.fileList) !== JSON.stringify(state.defaultValue)) {
    const fileList = props.defaultValue && props.defaultValue.fileList || [];
    return {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: [...fileList],
      previews: {}
    };
  }
  return null;
});
var _default = exports.default = FileUpload;