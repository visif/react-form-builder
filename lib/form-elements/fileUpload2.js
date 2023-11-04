"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _formContext = require("../context/form-context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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

var FileUpload = function FileUpload(props) {
  var _useFormContext = (0, _formContext.useFormContext)(),
    dispatch = _useFormContext.dispatch;
  var inputField = (0, _react.useRef)(null);
  var tableRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(props.defaultValue && props.defaultValue.fileList || []),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    fileList = _useState2[0],
    setFileList = _useState2[1];
  var onRemoveFile = function onRemoveFile(file) {
    var remainList = fileList.filter(function (item) {
      return item.fileName !== file.fileName;
    });
    dispatch({
      type: _formContext.FORM_ACTION.UPDATE_VALUE,
      name: props.data.field_name,
      value: (0, _toConsumableArray2["default"])(remainList)
    });
    setFileList((0, _toConsumableArray2["default"])(remainList));
  };
  var uploadAttachFile = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
      var fileName;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof props.onUploadFile !== "function")) {
              _context.next = 3;
              break;
            }
            console.log("FileUpload >>>>> not upload function found", props.onUploadFile);
            return _context.abrupt("return");
          case 3:
            _context.next = 5;
            return props.onUploadFile(file);
          case 5:
            fileName = _context.sent;
            return _context.abrupt("return", {
              originalName: file.name,
              fileName: fileName
            });
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function uploadAttachFile(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var onUploadMultipleFiles = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(event) {
      var newFileList, newResponse, i, currentFile, response;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            event.persist();
            if (!(!event || !event.target || !event.target.files)) {
              _context2.next = 3;
              break;
            }
            return _context2.abrupt("return");
          case 3:
            newFileList = Array.from(event.target.files);
            newResponse = [];
            i = 0;
          case 6:
            if (!(i < newFileList.length)) {
              _context2.next = 15;
              break;
            }
            currentFile = newFileList[i];
            _context2.next = 10;
            return uploadAttachFile(currentFile);
          case 10:
            response = _context2.sent;
            if (response) {
              newResponse.push(response);
            }
          case 12:
            i = i + 1;
            _context2.next = 6;
            break;
          case 15:
            dispatch({
              type: _formContext.FORM_ACTION.UPDATE_VALUE,
              name: props.data.field_name,
              value: [].concat((0, _toConsumableArray2["default"])(fileList), newResponse)
            });
            setFileList([].concat((0, _toConsumableArray2["default"])(fileList), newResponse));
          case 17:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function onUploadMultipleFiles(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  var onDownloadFile = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(file) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!(typeof props.onDownloadFile !== "function")) {
              _context3.next = 3;
              break;
            }
            console.log("FileUpload >>>>> no download function found", props.onDownloadFile);
            return _context3.abrupt("return");
          case 3:
            _context3.next = 5;
            return props.onDownloadFile(file);
          case 5:
            if (!isSameEditor) {
              props.disabled = "disabled";
            }
          case 6:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function onDownloadFile(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: tableRef,
    className: "SortableItem rfb-item".concat(props.data.pageBreakBefore ? " alwaysbreak" : "")
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
    multiple: true,
    ref: inputField,
    type: "file",
    name: "fileUpload",
    title: " ",
    style: {
      display: "none"
    },
    onChange: onUploadMultipleFiles,
    disabled: !isSameEditor
  }), /*#__PURE__*/_react["default"].createElement("a", {
    href: "#",
    style: {
      marginTop: 6
    },
    className: "btn btn-secondary",
    onClick: function onClick(e) {
      e.preventDefault();
      inputField && inputField.current.click();
    }
  }, "Upload files"), fileList && fileList.length > 0 && /*#__PURE__*/_react["default"].createElement("ul", {
    style: {
      display: "flex",
      maxWidth: "450px",
      flexDirection: "column",
      marginTop: "1rem"
    }
  }, fileList.map(function (file, index) {
    return /*#__PURE__*/_react["default"].createElement("li", {
      key: "file".concat(index),
      style: {
        listStyleType: "none",
        fontSize: 16,
        display: "block"
      }
    }, /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        "float": "left",
        cursor: "pointer"
      },
      onClick: function onClick() {
        onDownloadFile(file);
      }
    }, /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        marginRight: 4
      }
    }, index + 1, "."), " ", file.originalName), /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        "float": "right",
        cursor: "pointer",
        marginTop: 4
      },
      onClick: function onClick() {
        onRemoveFile(file);
      }
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-trash"
    })));
  })))));
};
var _default = FileUpload;
exports["default"] = _default;