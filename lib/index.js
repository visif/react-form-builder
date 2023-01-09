"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ElementStore", {
  enumerable: true,
  get: function get() {
    return _store["default"];
  }
});
exports.ReactFormBuilder = void 0;
Object.defineProperty(exports, "ReactFormGenerator", {
  enumerable: true,
  get: function get() {
    return _form["default"];
  }
});
Object.defineProperty(exports, "Registry", {
  enumerable: true,
  get: function get() {
    return _registry["default"];
  }
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var _preview = _interopRequireDefault(require("./preview"));
var _toolbar = _interopRequireDefault(require("./toolbar"));
var _form = _interopRequireDefault(require("./form"));
var _store = _interopRequireDefault(require("./stores/store"));
var _registry = _interopRequireDefault(require("./stores/registry"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ReactFormBuilder = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(ReactFormBuilder, _React$Component);
  var _super = _createSuper(ReactFormBuilder);
  function ReactFormBuilder(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ReactFormBuilder);
    _this = _super.call(this, props);
    _this.state = {
      editMode: false,
      editElement: null
    };
    _this.editModeOn = _this.editModeOn.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }
  (0, _createClass2["default"])(ReactFormBuilder, [{
    key: "editModeOn",
    value: function editModeOn(data, e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.editMode) {
        this.setState({
          editMode: !this.state.editMode,
          editElement: null
        });
      } else {
        this.setState({
          editMode: !this.state.editMode,
          editElement: data
        });
      }
    }
  }, {
    key: "manualEditModeOff",
    value: function manualEditModeOff() {
      if (this.state.editMode) {
        this.setState({
          editMode: false,
          editElement: null
        });
      }
    }

    // onPost () {
    //   if (typeof this.props.onPost === 'function') {
    //     this.props.onPost(data)
    //   }
    // }
  }, {
    key: "render",
    value: function render() {
      var toolbarProps = {
        showDescription: this.props.show_description
      };
      if (this.props.toolbarItems) {
        toolbarProps.items = this.props.toolbarItems;
      }
      return /*#__PURE__*/_react["default"].createElement(_reactDnd.DndProvider, {
        backend: _reactDndHtml5Backend.HTML5Backend
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "react-form-builder clearfix"
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_preview["default"], {
        files: this.props.files,
        manualEditModeOff: this.manualEditModeOff.bind(this),
        showCorrectColumn: this.props.showCorrectColumn,
        parent: this,
        data: this.props.data,
        url: this.props.url,
        saveUrl: this.props.saveUrl,
        onLoad: this.props.onLoad,
        onPost: this.props.onPost,
        editModeOn: this.editModeOn,
        editMode: this.state.editMode,
        variables: this.props.variables,
        registry: _registry["default"],
        editElement: this.state.editElement,
        renderEditForm: this.props.renderEditForm,
        onChange: this.props.onChange,
        uploadUrl: this.props.uploadUrl,
        onImageUpload: this.props.onImageUpload,
        getDataSource: this.props.getDataSource,
        getFormSource: this.props.getFormSource,
        getFormContent: this.props.getFormContent,
        getActiveUserProperties: function getActiveUserProperties() {
          return {
            name: "test",
            userId: "id001"
          };
        }
        // getDataSource={(data) => {
        //   if (data.sourceType === "name") {
        //     return [
        //       { id: 1, name: "NameA lastNameA" },
        //       { id: 2, name: "NameB lastNameB" },
        //     ];
        //   }

        //   if (data.sourceType === "department") {
        //     return [
        //       { id: 1, name: "departmentA" },
        //       { id: 2, name: "departmentB" },
        //     ];
        //   }

        //   if (data.sourceType === "role") {
        //     return [
        //       { id: 1, name: "roleA" },
        //       { id: 2, name: "roleB" },
        //     ];
        //   }

        //   if (data.sourceType === "form") {
        //     return [
        //       { id: 1, name: "formA" },
        //       { id: 2, name: "formB" },
        //     ];
        //   }

        //   return [];
        // }}
        // getFormSource={() => {
        //   return [
        //     { id: 1, name: "Form A", columns: ["columnA", "columnB"] },
        //     { id: 2, name: "Form B", columns: ["column1", "column2"] },
        //   ];
        // }}
        // getFormContent={() => {
        //   return {
        //     id: 1,
        //     name: "Form A",
        //     columns: [
        //       {
        //         element: "Dropdown",
        //         field_name:
        //           "dropdown_31939D9F-12B6-4B6C-8EE6-D78AE63285EB",
        //         id: "9238BFD5-B863-417B-AE8D-C351D508EB6C",
        //         label: "Department ",
        //         required: false,
        //         text: "เลือกจากรายการ",
        //       },
        //       {
        //         element: "TwoColumnRow",
        //         field_name:
        //           "two_col_row_03518784-A9D9-42DC-B101-E1AC6F3A8E7F",
        //         id: "28FA1B3C-DCA3-4014-B767-1C2ADB79BAC7",
        //         isContainer: true,
        //         required: false,
        //         text: "แบ่งสองคอลัมน์",
        //       },
        //       {
        //         element: "Table",
        //         field_name:
        //           "tables_1813ADB0-F4ED-4535-AAC8-590A3D59C30E",
        //         id: "86537F7A-2904-4CA6-92F9-FC0543120330",
        //         required: false,
        //         rowLabels: [],
        //         rows: 3,
        //         text: "ตาราง",
        //       },
        //       {
        //         element: "ImageUpload",
        //         field_name:
        //           "fileimage_91E0B712-B28C-4C47-A016-903B95FB6111",
        //         id: "AA5033CE-B1BD-43FB-94DB-4E9A1677C8BA",
        //         parentId: "28FA1B3C-DCA3-4014-B767-1C2ADB79BAC7",
        //         parentIndex: 4,
        //         required: false,
        //         text: "อัพโหลดภาพ",
        //       },
        //       {
        //         element: "TextInput",
        //         field_name:
        //           "text_input_DEC9A96A-0AF1-4A30-BB94-5CE4451452E4",
        //         id: "83385BAD-2C11-464A-9AA4-91341FEE5933",
        //         label: "Name ",
        //         parentId: "28FA1B3C-DCA3-4014-B767-1C2ADB79BAC7",
        //         parentIndex: 3,
        //         required: true,
        //         text: "กรอกบรรทัดเดียว",
        //       },
        //     ],
        //   };
        // }}
        ,
        onUploadFile: function onUploadFile(file) {
          return "".concat(file.name, "-").concat(Math.random() * 10000000);
        },
        onUploadImage: function onUploadImage(file) {
          return "path/".concat(file.name, "-").concat(Math.random() * 10000000);
        },
        onDownloadFile: function onDownloadFile(file) {
          return "download_".concat(file.name, "-").concat(Math.random() * 10000000);
        }
      }), /*#__PURE__*/_react["default"].createElement(_toolbar["default"], (0, _extends2["default"])({}, toolbarProps, {
        customItems: this.props.customToolbarItems
      }))))));
    }
  }]);
  return ReactFormBuilder;
}(_react["default"].Component);
exports.ReactFormBuilder = ReactFormBuilder;
var FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
FormBuilders.ReactFormGenerator = _form["default"];
FormBuilders.ElementStore = _store["default"];
FormBuilders.Registry = _registry["default"];
var _default = FormBuilders;
exports["default"] = _default;