"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactImageLightbox = _interopRequireDefault(require("react-image-lightbox"));
var _formDeleteButton = _interopRequireDefault(require("./form-delete-button"));
require("react-image-lightbox/style.css");
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
const isBrowserUrl = value => !!value && /^(https?:|blob:|data:)/i.test(value);

// This only needs to be imported once in your app

class ImageUpload extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "resolveDisplayUrl", async () => {
      const {
        filePath,
        blobUrl
      } = this.state;
      // Fresh same-session blob previews are fine; saved blob: URLs from prior
      // sessions are dead and must not block resolving filePath.
      if (isBrowserUrl(blobUrl) && String(blobUrl).startsWith('blob:') && !filePath) {
        this.setState({
          displayUrl: blobUrl,
          resolveDone: true
        });
        return;
      }
      if (isBrowserUrl(filePath)) {
        this.setState({
          displayUrl: filePath,
          resolveDone: true
        });
        return;
      }
      if (isBrowserUrl(blobUrl) && !String(blobUrl).startsWith('blob:')) {
        this.setState({
          displayUrl: blobUrl,
          resolveDone: true
        });
        return;
      }
      if (!filePath || typeof this.props.resolveImageUrl !== 'function') {
        this.setState({
          displayUrl: '',
          resolveDone: true
        });
        return;
      }
      try {
        const resolved = await this.props.resolveImageUrl(filePath);
        if (this.state.filePath === filePath) {
          this.setState({
            displayUrl: resolved || '',
            resolveDone: true
          });
        }
      } catch (error) {
        console.log('resolveImageUrl failed', error);
        if (this.state.filePath === filePath) {
          this.setState({
            displayUrl: '',
            resolveDone: true
          });
        }
      }
    });
    (0, _defineProperty2.default)(this, "onRemoveImage", () => {
      if (!confirm('Confirm delete?')) {
        return;
      }
      this.setState(() => {
        return {
          filePath: '',
          fileName: '',
          blobUrl: '',
          displayUrl: '',
          resolveDone: true
        };
      });
    });
    (0, _defineProperty2.default)(this, "uploadImageFile", async event => {
      event.persist();
      if (!event || !event.target || !event.target.files) {
        return;
      }
      const file = Array.from(event.target.files)[0];
      if (typeof this.props.onUploadImage !== 'function') {
        console.log('onUploadImage >>>>> no upload function found', this.props.onUploadImage);
        return;
      }
      console.log('Uploading image .....');
      const extension = "".concat(file.name).substring(file.name.lastIndexOf('.'));
      const filePath = await this.props.onUploadImage(file);
      if (!filePath) {
        return;
      }
      const blobUrl = URL.createObjectURL(file);

      // Keep "{serverFile}{ext}" storage format expected by FormService attachment move.
      this.setState({
        fileName: file.name,
        blobUrl,
        displayUrl: blobUrl,
        resolveDone: true,
        filePath: "".concat(filePath).concat(extension)
      });
    });
    this.inputField = /*#__PURE__*/_react.default.createRef(null);
    const _filePath = props.defaultValue && props.defaultValue.filePath;
    const fileName = props.defaultValue && props.defaultValue.fileName;
    const _blobUrl = props.defaultValue && props.defaultValue.blobUrl;
    const initialDisplay = isBrowserUrl(_blobUrl) || isBrowserUrl(_filePath) ? _blobUrl || _filePath : '';
    this.state = {
      defaultValue: props.defaultValue,
      filePath: _filePath,
      fileName,
      blobUrl: _blobUrl,
      displayUrl: initialDisplay,
      resolveDone: !!initialDisplay || !_filePath,
      isOpen: false
    };
  }
  componentDidMount() {
    this.resolveDisplayUrl();
  }
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.filePath !== this.state.filePath || prevState.blobUrl !== this.state.blobUrl) {
      this.resolveDisplayUrl();
    }
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const rawEditor = this.props.editor;
    const savedEditor = Array.isArray(rawEditor) ? rawEditor[0] : rawEditor;
    const hasValue = !!(this.state.filePath || this.state.blobUrl);
    const previewSrc = this.state.displayUrl || (isBrowserUrl(this.state.blobUrl) && String(this.state.blobUrl).startsWith('blob:') ? this.state.blobUrl : '');
    const resolveDone = this.state.resolveDone !== false;
    const isReadOnly = !!(this.props.read_only || this.props.data && this.props.data.readOnly);

    // Empty field: anyone who can fill the form may upload.
    // Existing image: only the uploader (editor) or DCC may replace/remove.
    let canEditImage = !isReadOnly;
    if (hasValue && savedEditor && savedEditor.userId != null && userProperties) {
      const sameUploader = String(userProperties.userId) === String(savedEditor.userId);
      const isDcc = userProperties.hasDCCRole === true;
      canEditImage = !isReadOnly && (sameUploader || isDcc);
    } else if (hasValue && savedEditor && savedEditor.userId != null && !userProperties) {
      canEditImage = false;
    }
    const showUpload = resolveDone && canEditImage && !hasValue;
    const showRemove = resolveDone && canEditImage && hasValue;
    const actionStyle = {
      display: 'inline-block',
      marginRight: 8
    };
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "Uploaded by: ".concat(savedEditor.name) : '';
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: this.tableRef,
      className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : ''),
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        position: 'relative'
      }
    }, previewSrc ? /*#__PURE__*/_react.default.createElement("img", {
      style: {
        width: '100%',
        cursor: 'pointer'
      },
      onClick: () => {
        this.setState({
          isOpen: true
        });
      },
      src: previewSrc
    }) : this.state.filePath && !this.state.resolveDone ? /*#__PURE__*/_react.default.createElement("div", {
      className: "no-image",
      style: {
        minHeight: 80,
        border: '1px dashed #d9d9d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }
    }, "Loading image...") : null), (showUpload || showRemove) && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/_react.default.createElement("input", {
      ref: this.inputField,
      type: "file",
      accept: "image/*",
      name: "fileUpload",
      title: " ",
      style: {
        display: 'none'
      },
      onChange: this.uploadImageFile
    }), showUpload && /*#__PURE__*/_react.default.createElement("a", {
      href: "",
      className: "btn btn-secondary",
      style: actionStyle,
      onClick: e => {
        this.inputField && this.inputField.current.click();
        e.preventDefault();
      }
    }, "Upload Image"), showRemove && /*#__PURE__*/_react.default.createElement(_formDeleteButton.default, {
      title: "Remove Image",
      onClick: () => this.onRemoveImage()
    }))), this.state.isOpen && previewSrc && /*#__PURE__*/_react.default.createElement(_reactImageLightbox.default, {
      mainSrc: previewSrc
      // Form opens inside Ant Design Drawer (z-index ~1000). Default lightbox
      // overlay is also 1000, so raise it so original-size preview appears on top.
      ,
      reactModalStyle: {
        overlay: {
          zIndex: 2000
        },
        content: {
          zIndex: 2000
        }
      },
      onCloseRequest: () => this.setState({
        isOpen: false
      })
    }));
  }
}
(0, _defineProperty2.default)(ImageUpload, "getDerivedStateFromProps", (props, state) => {
  console.log('ImageUpload >> getDerivedStateFromProps');
  console.log(props.defaultValue);
  if (props.defaultValue && JSON.stringify(props.defaultValue) !== JSON.stringify(state.defaultValue)) {
    const filePath = props.defaultValue && props.defaultValue.filePath;
    const fileName = props.defaultValue && props.defaultValue.fileName;
    const blobUrl = props.defaultValue && props.defaultValue.blobUrl;
    const displayUrl = isBrowserUrl(blobUrl) || isBrowserUrl(filePath) ? blobUrl || filePath : '';
    return {
      defaultValue: props.defaultValue,
      filePath,
      fileName,
      blobUrl,
      displayUrl,
      resolveDone: !!displayUrl || !filePath
    };
  }
  return null;
});
var _default = exports.default = ImageUpload;