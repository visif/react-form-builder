"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactImageLightbox = _interopRequireDefault(require("react-image-lightbox"));
require("react-image-lightbox/style.css");
var _componentHeader = _interopRequireDefault(require("./component-header"));
// This only needs to be imported once in your app

class ImageUpload extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "onRemoveImage", () => {
      if (!confirm('Confirm delete?')) {
        return;
      }
      this.setState(() => {
        return {
          filePath: '',
          fileName: '',
          blobUrl: ''
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
      const blobUrl = URL.createObjectURL(file);
      this.setState({
        fileName: file.name,
        blobUrl,
        filePath: "".concat(filePath).concat(extension)
      });
    });
    this.inputField = /*#__PURE__*/_react.default.createRef(null);
    const _filePath = props.defaultValue && props.defaultValue.filePath;
    const fileName = props.defaultValue && props.defaultValue.fileName;
    const _blobUrl = props.defaultValue && props.defaultValue.blobUrl;
    this.state = {
      defaultValue: props.defaultValue,
      filePath: _filePath,
      fileName,
      blobUrl: _blobUrl,
      isOpen: false
    };
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;
    const hasValue = this.state.filePath || this.state.blobUrl;

    // Allow editing if no value exists OR if user is the same editor
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text showing editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "Edited by: ".concat(savedEditor.name) : '';
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: this.tableRef,
      className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : ''),
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "btn is-isolated",
      onClick: this.onRemoveImage,
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        display: this.state.filePath ? '' : 'none'
      }
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "is-isolated fas fa-trash"
    })), /*#__PURE__*/_react.default.createElement("img", {
      style: {
        width: '100%',
        cursor: 'pointer'
      },
      onClick: () => {
        this.setState({
          isOpen: true
        });
      },
      src: this.state.blobUrl || this.state.filePath ? this.state.blobUrl || this.state.filePath : ''
    })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("input", {
      ref: this.inputField,
      type: "file",
      name: "fileUpload",
      title: " ",
      style: {
        display: 'none'
      },
      onChange: this.uploadImageFile
    }), /*#__PURE__*/_react.default.createElement("a", {
      href: "",
      className: "btn btn-secondary",
      style: {
        display: this.state.filePath ? 'none' : 'inline-block',
        pointerEvents: isSameEditor ? 'auto' : 'none'
      },
      onClick: e => {
        this.inputField && this.inputField.current.click();
        e.preventDefault();
      }
    }, "Upload Image"))), this.state.isOpen && /*#__PURE__*/_react.default.createElement(_reactImageLightbox.default, {
      mainSrc: this.state.blobUrl || this.state.filePath,
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
    return {
      defaultValue: props.defaultValue,
      filePath,
      fileName,
      blobUrl
    };
  }
  return state;
});
var _default = exports.default = ImageUpload;