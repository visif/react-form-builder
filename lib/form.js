"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof3 = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _fbemitter = require("fbemitter");
var _formValidator = _interopRequireDefault(require("./form-validator"));
var _formElements = _interopRequireDefault(require("./form-elements"));
var _multiColumn = require("./multi-column");
var _customElement = _interopRequireDefault(require("./form-elements/custom-element"));
var _registry = _interopRequireDefault(require("./stores/registry"));
var _formContext = require("./context/form-context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Image = _formElements["default"].Image,
  Checkboxes = _formElements["default"].Checkboxes,
  Signature = _formElements["default"].Signature,
  Signature2 = _formElements["default"].Signature2,
  FileUpload = _formElements["default"].FileUpload,
  ImageUpload = _formElements["default"].ImageUpload,
  Download = _formElements["default"].Download,
  Camera = _formElements["default"].Camera,
  DataSource = _formElements["default"].DataSource;
var convert = function convert(answers) {
  if (Array.isArray(answers)) {
    var result = {};
    answers.forEach(function (x) {
      if (x.name && x.name.indexOf("tags_") > -1) {
        result[x.name] = x.value.map(function (y) {
          return y.value;
        });
      } else {
        result[x.name] = x.value;
      }
    });
    return result;
  }
  return answers || {};
};

// export default class ReactForm extends React.Component {
//   form;

//   inputs = {};

//   constructor(props) {
//     super(props);
//     this.emitter = new EventEmitter();
//     this.getDataById = this.getDataById.bind(this);
//     this.state = {
//       answerData: convert(props.answer_data),
//     };
//   }

//   static getDerivedStateFromProps(props) {
//     return {
//       answerData: convert(props.answer_data),
//     };
//   }

//   _getDefaultValue(item) {
//     return this.state.answerData[item.field_name];
//   }

//   _getEditor(item) {
//     if (!this.props.answer_data || !Array.isArray(this.props.answer_data)) {
//       return null;
//     }
//     const itemAns = this.props.answer_data.find(
//       (x) => x.name === item.field_name
//     );
//     return itemAns && itemAns.editor;
//   }

//   _optionsDefaultValue(item) {
//     const defaultValue = this._getDefaultValue(item);
//     if (defaultValue) {
//       return defaultValue;
//     }

//     const defaultChecked = [];
//     item.options.forEach((option) => {
//       if (this.state.answerData[`option_${option.key}`]) {
//         defaultChecked.push(option.key);
//       }
//     });
//     return defaultChecked;
//   }

//   _getItemValue(item, ref) {
//     let $item = {
//       element: item.element,
//       value: ref && ref.value,
//     };
//     if (item.element === "Rating") {
//       $item.value = ref.state.rating;
//     } else if (item.element === "Tags") {
//       $item.value = ref.state.value;
//     } else if (item.element === "DatePicker") {
//       $item.value = ref.input.value;
//     } else if (item.element === "Camera") {
//       $item.value = ref.src
//         ? ref.src.replace("data:image/png;base64,", "")
//         : "";
//     } else if (item.element === "Table") {
//       $item.value = ref.state.inputs;
//     } else if (item.element === "Signature2" && ref.state.isSigned) {
//       $item.value = {
//         isSigned: ref.state.isSigned,
//         signedPerson: ref.state.signedPerson,
//         signedPersonId: ref.state.signedPersonId,
//       };
//     } else if (item.element === "DataSource" && ref.state.searchText) {
//       $item.value = {
//         type: ref.props.data.sourceType,
//         value: ref.state.searchText,
//         selectedItem: ref.state.selectedItem,
//       };
//     } else if (item.element === "FileUpload") {
//       $item.value = {
//         fileList: ref.state.fileList,
//       };
//     } else if (item.element === "ImageUpload") {
//       $item.value = {
//         filePath: ref.state.filePath,
//         fileName: ref.state.fileName,
//         blobUrl: ref.state.blobUrl,
//       };
//     } else if (ref && ref.inputField && ref.inputField.current) {
//       $item = ReactDOM.findDOMNode(ref.inputField.current);
//       if ($item && typeof $item.value === "string") {
//         $item.value = $item.value.trim();
//       }
//     }

//     return $item;
//   }

//   _isIncorrect(item) {
//     let incorrect = false;
//     if (item.canHaveAnswer) {
//       const ref = this.inputs[item.field_name];
//       if (item.element === "Checkboxes" || item.element === "RadioButtons") {
//         item.options.forEach((option) => {
//           const $option = ReactDOM.findDOMNode(
//             ref.options[`child_ref_${option.key}`]
//           );
//           if (
//             (option.hasOwnProperty("correct") && !$option.checked) ||
//             (!option.hasOwnProperty("correct") && $option.checked)
//           ) {
//             incorrect = true;
//           }
//         });
//       } else {
//         const $item = this._getItemValue(item, ref);
//         if (item.element === "Rating") {
//           if ($item.value.toString() !== item.correct) {
//             incorrect = true;
//           }
//         } else if (
//           $item.value.toLowerCase() !== item.correct.trim().toLowerCase()
//         ) {
//           incorrect = true;
//         }
//       }
//     }
//     return incorrect;
//   }

//   _isInvalid(item) {
//     let invalid = false;
//     if (item.required === true) {
//       const ref = this.inputs[item.field_name];
//       if (item.element === "Checkboxes" || item.element === "RadioButtons") {
//         let checked_options = 0;
//         item.options.forEach((option) => {
//           const $option = ReactDOM.findDOMNode(
//             ref.options[`child_ref_${option.key}`]
//           );
//           if ($option.checked) {
//             checked_options += 1;
//           }
//         });
//         if (checked_options < 1) {
//           // errors.push(item.label + ' is required!');
//           invalid = true;
//         }
//       } else {
//         const $item = this._getItemValue(item, ref);
//         if (item.element === "Rating") {
//           if ($item.value === 0) {
//             invalid = true;
//           }
//         } else if (
//           $item.element === "FileUpload" &&
//           (!$item.value.fileList || $item.value.fileList.length <= 0)
//         ) {
//           invalid = true;
//         } else if (item.element === "ImageUpload" && !item.value.filePath) {
//           invalid = true;
//         } else if (
//           $item.value === undefined ||
//           $item.value === null ||
//           $item.value.length < 1
//         ) {
//           invalid = true;
//         }
//       }
//     }
//     return invalid;
//   }

//   _collect(item) {
//     const itemData = {
//       name: item.field_name,
//       custom_name: item.custom_name || item.field_name,
//     };
//     const ref = this.inputs[item.field_name];
//     const activeUser = this.props.getActiveUserProperties();
//     const oldEditor = this._getEditor(item);

//     if (item.element === "Checkboxes" || item.element === "RadioButtons") {
//       const checked_options = [];

//       item.options.forEach((option) => {
//         const $option = ReactDOM.findDOMNode(
//           ref.options[`child_ref_${option.key}`]
//         );
//         if ($option.checked) {
//           let info = "";

//           if (option.info) {
//             const $info = ReactDOM.findDOMNode(
//               ref.infos[`child_ref_${option.key}_info`]
//             );
//             info = $info?.value ?? "";
//           }

//           checked_options.push({
//             key: option.key,
//             value: true,
//             info: info,
//           });
//         }
//       });

//       itemData.value = checked_options;
//       itemData.editor = oldEditor
//         ? oldEditor
//         : checked_options.length > 0
//         ? activeUser
//         : null;
//     } else {
//       if (!ref) {
//         return null;
//       }

//       const valueItem = this._getItemValue(item, ref);

//       itemData.value = valueItem.value;
//       itemData.editor = oldEditor
//         ? oldEditor
//         : valueItem.value
//         ? activeUser
//         : null;
//       if (item.element === "Signature2") {
//         itemData.editor = oldEditor
//           ? oldEditor
//           : valueItem.value.isSigned
//           ? activeUser
//           : null;
//       } else if (item.element === "DataSource" && ref.state.searchText) {
//         itemData.editor = oldEditor
//           ? oldEditor
//           : valueItem.value.value
//           ? activeUser
//           : null;
//       } else if (item.element === "FileUpload") {
//         itemData.editor = oldEditor
//           ? oldEditor
//           : valueItem.value.fileList && valueItem.value.fileList.length > 0
//           ? activeUser
//           : null;
//       } else if (item.element === "ImageUpload") {
//         itemData.editor = oldEditor
//           ? oldEditor
//           : valueItem.value.filePath
//           ? activeUser
//           : null;
//       } else if (item.element === "Table") {
//         itemData.editor = oldEditor
//           ? oldEditor
//           : valueItem.value.find((itemRow) => {
//               return itemRow.find((val) => !!val);
//             })
//           ? activeUser
//           : null;
//       }
//     }

//     return itemData;
//   }

//   _collectFormData(data) {
//     const formData = [];
//     data.forEach((item) => {
//       const item_data = this._collect(item);
//       if (item_data) {
//         formData.push(item_data);
//       }
//     });
//     return formData;
//   }

//   _collectFormItems(data) {
//     const formData = [];
//     data.forEach((item) => {
//       const itemValue = this._collect(item);
//       const itemData = {
//         id: item.id,
//         element: item.element,
//         value: itemValue && itemValue.value,
//       };

//       formData.push(itemData);
//     });

//     return formData;
//   }

//   _getSignatureImg(item) {
//     const ref = this.inputs[item.field_name];
//     const $canvas_sig = ref.canvas.current;
//     if ($canvas_sig) {
//       const base64 = $canvas_sig
//         .toDataURL()
//         .replace("data:image/png;base64,", "");
//       const isEmpty = $canvas_sig.isEmpty();
//       const $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
//       if (isEmpty) {
//         $input_sig.value = "";
//       } else {
//         $input_sig.value = base64;
//       }
//     }
//   }

//   handleSubmit(e) {
//     e.preventDefault();

//     // let errors = [];
//     // if (!this.props.skip_validations) {
//     //   errors = this.validateForm();
//     //   // Publish errors, if any.
//     //   this.emitter.emit('formValidation', errors);
//     // }

//     // // Only submit if there are no errors.
//     // if (errors.length < 1) {
//     const { onSubmit } = this.props;

//     // submit with no form
//     if (onSubmit) {
//       let errors = [];
//       if (!this.props.skip_validations) {
//         errors = this.validateForm();
//         // Publish errors, if any.
//         this.emitter.emit("formValidation", errors);
//       }

//       // Only submit if there are no errors.
//       if (errors.length < 1) {
//         const data = this._collectFormData(this.props.data);
//         onSubmit(data);
//       }
//     } else {
//       // incase no submit function provided => go to form submit

//       let errors = [];
//       if (!this.props.skip_validations) {
//         errors = this.validateForm();
//         // Publish errors, if any.
//         this.emitter.emit("formValidation", errors);
//       }

//       // Only submit if there are no errors.
//       if (errors.length < 1) {
//         const $form = ReactDOM.findDOMNode(this.form);
//         $form.submit();
//       }
//     }
//     // }
//   }

//   validateForm() {
//     const errors = [];
//     let data_items = this.props.data;

//     // re-order items to avoid items inside
//     let orderedItems = [];
//     this.props.data.forEach((item) => {
//       const childItems = this.props.data.filter(
//         (child) => child.parentId === item.id
//       );
//       if (childItems?.length > 0) {
//         orderedItems = orderedItems.concat(childItems);
//       } else if (!item.parentId) {
//         orderedItems.push(item);
//       }
//     });

//     // get all input items
//     const formItems = this._collectFormItems(orderedItems);
//     const sectionItems = formItems.filter((item) => item.element === "Section");

//     // Validate with special condition when there is any section
//     if (sectionItems.length > 0) {
//       // split items into groups by section
//       const firstItem = formItems[0];
//       let activeSectionKey =
//         firstItem.element === "Section" ? firstItem.id : "";
//       const sectionGroup = {};
//       sectionGroup[activeSectionKey] = [];

//       // group items by section separator
//       formItems.forEach((item) => {
//         if (item.element === "Section") {
//           activeSectionKey = item.id;
//           sectionGroup[activeSectionKey] = [];
//         } else {
//           sectionGroup[activeSectionKey].push(item);
//         }
//       });

//       let activeItems = [];

//       // find only active section => there is any item with value input
//       const reverseKeys = sectionItems.map((item) => item.id).reverse();
//       reverseKeys.push("");
//       let activeSectionFound = false;

//       reverseKeys.forEach((key) => {
//         const items = sectionGroup[key];
//         let fillingItems = items;

//         // incase of section separator
//         if (key && !activeSectionFound) {
//           fillingItems = items.find(
//             (item) =>
//               item.element !== "Table" &&
//               item.element !== "Dropdown" &&
//               item.element !== "Range" &&
//               ((Array.isArray(item.value) && item.value.length > 0) ||
//                 (typeof item.value !== "object" &&
//                   !Array.isArray(item.value) &&
//                   !!item.value) ||
//                 (item.element === "FileUpload" &&
//                   item.value.fileList &&
//                   item.value.fileList.length > 0) ||
//                 (item.element === "ImageUpload" && !!item.value.filePath))
//           );

//           activeSectionFound = !!fillingItems;
//         }

//         if (fillingItems) {
//           activeItems = activeItems.concat(items);
//         }
//       });

//       const itemIds = activeItems.map((item) => item.id);
//       data_items = this.props.data.filter((item) => itemIds.includes(item.id));
//     }

//     data_items.forEach((item) => {
//       if (item.element === "Signature") {
//         this._getSignatureImg(item);
//       }

//       if (this._isInvalid(item)) {
//         errors.push(`${item.label || item.position} is required!`);
//       }

//       if (this.props.validateForCorrectness && this._isIncorrect(item)) {
//         errors.push(`${item.label} was answered incorrectly!`);
//       }
//     });

//     return errors;
//   }

//   getDataById(id) {
//     const { data } = this.props;
//     const item = data.find((x) => x.id === id);
//     return item;
//   }

//   getInputElement(item) {
//     if (item.custom) {
//       return this.getCustomElement(item);
//     }
//     const Input = FormElements[item.element];
//     return (
//       <Input
//         handleChange={this.handleChange}
//         ref={(c) => {
//           this.inputs[item.field_name] = c;
//         }}
//         mutable={true}
//         key={`form_${item.id}`}
//         data={item}
//         read_only={this.props.read_only}
//         defaultValue={this._getDefaultValue(item)}
//         editor={this._getEditor(item)}
//         getActiveUserProperties={this.props.getActiveUserProperties}
//         getDataSource={this.props.getDataSource}
//         onUploadFile={this.props.onUploadFile}
//         onDownloadFile={this.props.onDownloadFile}
//         onUploadImage={this.props.onUploadImage}
//         getFormSource={this.props.getFormSource}
//       />
//     );
//   }

//   getContainerElement(item, Element) {
//     const controls = item.childItems.map((x) => {
//       const currentItem = this.getDataById(x);
//       return x && currentItem ? (
//         this.getInputElement(currentItem)
//       ) : (
//         <div>&nbsp;</div>
//       );
//     });
//     return (
//       <Element
//         mutable={true}
//         key={`form_${item.id}`}
//         data={item}
//         controls={controls}
//       />
//     );
//   }

//   getSimpleElement(item) {
//     const Element = FormElements[item.element];
//     return <Element mutable={true} key={`form_${item.id}`} data={item} />;
//   }

//   getCustomElement(item) {
//     if (!item.component || typeof item.component !== "function") {
//       item.component = Registry.get(item.key);
//       if (!item.component) {
//         console.error(`${item.element} was not registered`);
//       }
//     }

//     const inputProps = item.forwardRef && {
//       handleChange: this.handleChange,
//       defaultValue: this._getDefaultValue(item),
//       ref: (c) => (this.inputs[item.field_name] = c),
//     };
//     return (
//       <CustomElement
//         mutable={true}
//         read_only={this.props.read_only}
//         key={`form_${item.id}`}
//         data={item}
//         {...inputProps}
//       />
//     );
//   }

//   handleRenderSubmit = () => {
//     const { actionName = "Submit", submitButton = false } = this.props;

//     return (
//       submitButton || (
//         <input type="submit" className="btn btn-big" value={actionName} />
//       )
//     );
//   };

//   render() {
//     let data_items = this.props.data;

//     if (this.props.display_short) {
//       data_items = this.props.data.filter((i) => i.alternateForm === true);
//     }

//     data_items.forEach((item) => {
//       if (
//         item &&
//         item.readOnly &&
//         item.variableKey &&
//         this.props.variables[item.variableKey]
//       ) {
//         this.state.answerData[item.field_name] =
//           this.props.variables[item.variableKey];
//       }
//     });

//     const items = data_items
//       .filter((x) => !x.parentId)
//       .map((item) => {
//         if (!item) return null;
//         switch (item.element) {
//           case "TextInput":
//           case "NumberInput":
//           case "TextArea":
//           case "Table":
//           case "Dropdown":
//           case "DatePicker":
//           case "RadioButtons":
//           case "Rating":
//           case "Tags":
//           case "Range":
//             return this.getInputElement(item);
//           case "DataSource":
//             return (
//               <DataSource
//                 handleChange={this.handleChange}
//                 ref={(c) => {
//                   this.inputs[item.field_name] = c;
//                 }}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 read_only={this.props.read_only}
//                 defaultValue={this._getDefaultValue(item)}
//                 editor={this._getEditor(item)}
//                 getDataSource={this.props.getDataSource}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//               />
//             );
//           case "CustomElement":
//             return this.getCustomElement(item);
//           case "FourColumnRow":
//             return this.getContainerElement(item, FourColumnRow);
//           case "ThreeColumnRow":
//             return this.getContainerElement(item, ThreeColumnRow);
//           case "TwoColumnRow":
//             return this.getContainerElement(item, TwoColumnRow);
//           case "Signature":
//             return (
//               <Signature
//                 ref={(c) => (this.inputs[item.field_name] = c)}
//                 read_only={this.props.read_only || item.readOnly}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 defaultValue={this._getDefaultValue(item)}
//                 editor={this._getEditor(item)}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//               />
//             );
//           case "Signature2":
//             return (
//               <Signature2
//                 ref={(c) => (this.inputs[item.field_name] = c)}
//                 read_only={this.props.read_only || item.readOnly}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 defaultValue={this._getDefaultValue(item)}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//                 editor={this._getEditor(item)}
//               />
//             );
//           case "Checkboxes":
//             return (
//               <Checkboxes
//                 ref={(c) => (this.inputs[item.field_name] = c)}
//                 read_only={this.props.read_only}
//                 handleChange={this.handleChange}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 defaultValue={this._optionsDefaultValue(item)}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//                 editor={this._getEditor(item)}
//               />
//             );
//           case "Image":
//             return (
//               <Image
//                 ref={(c) => (this.inputs[item.field_name] = c)}
//                 handleChange={this.handleChange}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 defaultValue={this._getDefaultValue(item)}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//                 editor={this._getEditor(item)}
//               />
//             );
//           case "Download":
//             return (
//               <Download
//                 download_path={this.props.download_path}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 editor={this._getEditor(item)}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//               />
//             );
//           case "Camera":
//             return (
//               <Camera
//                 ref={(c) => (this.inputs[item.field_name] = c)}
//                 read_only={this.props.read_only || item.readOnly}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 defaultValue={this._getDefaultValue(item)}
//                 editor={this._getEditor(item)}
//               />
//             );
//           case "FileUpload":
//             return (
//               <FileUpload
//                 ref={(c) => (this.inputs[item.field_name] = c)}
//                 read_only={this.props.read_only || item.readOnly}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 defaultValue={this._getDefaultValue(item)}
//                 onUploadFile={this.props.onUploadFile}
//                 onDownloadFile={this.props.onDownloadFile}
//                 editor={this._getEditor(item)}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//               />
//             );
//           case "ImageUpload":
//             return (
//               <ImageUpload
//                 ref={(c) => (this.inputs[item.field_name] = c)}
//                 read_only={this.props.read_only || item.readOnly}
//                 mutable={true}
//                 key={`form_${item.id}`}
//                 data={item}
//                 defaultValue={this._getDefaultValue(item)}
//                 onUploadImage={this.props.onUploadImage}
//                 editor={this._getEditor(item)}
//                 getActiveUserProperties={this.props.getActiveUserProperties}
//               />
//             );
//           default:
//             return this.getSimpleElement(item);
//         }
//       });

//     const formTokenStyle = {
//       display: "none",
//     };

//     const backName = this.props.back_name ? this.props.back_name : "Cancel";

//     return (
//       <FormProvider>
//         <div>
//           <FormValidator emitter={this.emitter} />
//           <div className="react-form-builder-form">
//             <form
//               encType="multipart/form-data"
//               ref={(c) => (this.form = c)}
//               action={this.props.form_action}
//               onSubmit={this.handleSubmit.bind(this)}
//               method={this.props.form_method}
//             >
//               {this.props.authenticity_token && (
//                 <div style={formTokenStyle}>
//                   <input name="utf8" type="hidden" value="&#x2713;" />
//                   <input
//                     name="authenticity_token"
//                     type="hidden"
//                     value={this.props.authenticity_token}
//                   />
//                   <input
//                     name="task_id"
//                     type="hidden"
//                     value={this.props.task_id}
//                   />
//                 </div>
//               )}
//               {items}
//               <div className="btn-toolbar">
//                 {!this.props.hide_actions && this.handleRenderSubmit()}
//                 {!this.props.hide_actions && this.props.back_action && (
//                   <a
//                     href={this.props.back_action}
//                     className="btn btn-default btn-cancel btn-big"
//                   >
//                     {backName}
//                   </a>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </FormProvider>
//     );
//   }
// }

var ReactForm = function ReactForm(props) {
  var formRef = (0, _react.useRef)(null);
  var inputsRef = (0, _react.useRef)({});
  var _useState = (0, _react.useState)(convert(props.answer_data)),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    answerData = _useState2[0],
    setAnswerData = _useState2[1];
  var _useFormContext = (0, _formContext.useFormContext)(),
    formValues = _useFormContext.formValues;
  (0, _react.useEffect)(function () {
    setAnswerData(convert(props.answer_data));
  }, [props.answer_data]);
  function _getDefaultValue(item) {
    return answerData[item.field_name];
  }
  function _getEditor(item) {
    if (!props.answer_data || !Array.isArray(props.answer_data)) {
      return null;
    }
    var itemAns = props.answer_data.find(function (x) {
      return x.name === item.field_name;
    });
    return itemAns && itemAns.editor;
  }
  function _optionsDefaultValue(item) {
    var defaultValue = _getDefaultValue(item);
    if (defaultValue) {
      return defaultValue;
    }
    var defaultChecked = [];
    item.options.forEach(function (option) {
      if (answerData["option_".concat(option.key)]) {
        defaultChecked.push(option.key);
      }
    });
    return defaultChecked;
  }
  function _getItemValue(item, ref) {
    var $item = {
      element: item.element,
      value: ref && ref.value
    };
    if (item.element === "Rating") {
      $item.value = ref.state.rating;
    } else if (item.element === "Tags") {
      $item.value = ref.state.value;
    } else if (item.element === "DatePicker") {
      $item.value = ref.input.value;
    } else if (item.element === "Camera") {
      $item.value = ref.src ? ref.src.replace("data:image/png;base64,", "") : "";
    } else if (item.element === "Table") {
      $item.value = ref.state.inputs;
    } else if (item.element === "Signature2") {
      var _formValues$item$fiel;
      var dataVal = ((_formValues$item$fiel = formValues[item.field_name]) === null || _formValues$item$fiel === void 0 ? void 0 : _formValues$item$fiel.value) || {};
      if (dataVal.isSigned) {
        $item.value = dataVal;
      }
    } else if (item.element === "DataSource" && ref.state.searchText) {
      $item.value = {
        type: ref.props.data.sourceType,
        value: ref.state.searchText,
        selectedItem: ref.state.selectedItem
      };
    } else if (item.element === "FileUpload") {
      $item.value = {
        fileList: ref.state.fileList
      };
    } else if (item.element === "ImageUpload") {
      $item.value = {
        filePath: ref.state.filePath,
        fileName: ref.state.fileName,
        blobUrl: ref.state.blobUrl
      };
    } else if (ref && ref.inputField && ref.inputField.current) {
      $item = _reactDom["default"].findDOMNode(ref.inputField.current);
      if ($item && typeof $item.value === "string") {
        $item.value = $item.value.trim();
      }
    }
    return $item;
  }
  function _isIncorrect(item) {
    var incorrect = false;
    if (item.canHaveAnswer) {
      var ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        item.options.forEach(function (option) {
          var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);
          if (option.hasOwnProperty("correct") && !$option.checked || !option.hasOwnProperty("correct") && $option.checked) {
            incorrect = true;
          }
        });
      } else {
        var $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value.toString() !== item.correct) {
            incorrect = true;
          }
        } else if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
          incorrect = true;
        }
      }
    }
    return incorrect;
  }
  function _isInvalid(item) {
    var invalid = false;
    if (item.required === true) {
      var ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        var checked_options = 0;
        item.options.forEach(function (option) {
          var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);
          if ($option.checked) {
            checked_options += 1;
          }
        });
        if (checked_options < 1) {
          invalid = true;
        }
      } else {
        var $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value === 0) {
            invalid = true;
          }
        } else if ($item.element === "FileUpload" && (!$item.value.fileList || $item.value.fileList.length <= 0)) {
          invalid = true;
        } else if (item.element === "ImageUpload" && !item.value.filePath) {
          invalid = true;
        } else if ($item.value === undefined || $item.value === null || $item.value.length < 1) {
          invalid = true;
        }
      }
    }
    return invalid;
  }
  function _collect(item) {
    var itemData = {
      name: item.field_name,
      custom_name: item.custom_name || item.field_name
    };
    var ref = inputsRef.current[item.field_name];
    var activeUser = props.getActiveUserProperties();
    var oldEditor = _getEditor(item);
    if (item.element === "Checkboxes" || item.element === "RadioButtons") {
      var dataVal = formValues[item.field_name] && formValues[item.field_name].value || [];
      itemData.value = dataVal;
      itemData.editor = oldEditor ? oldEditor : dataVal.length > 0 ? activeUser : null;
    } else if (item.element === "FileUpload") {
      itemData.value = formValues[item.field_name] || [];
      itemData.editor = oldEditor ? oldEditor : itemData.value > 0 ? activeUser : null;
    } else if (item.element === "Signature2") {
      itemData.value = formValues[item.field_name] || {};
      itemData.editor = oldEditor ? oldEditor : itemData.value.isSigned ? activeUser : null;
    } else {
      if (!ref) {
        return null;
      }
      var valueItem = _getItemValue(item, ref);
      itemData.value = valueItem.value;
      itemData.editor = oldEditor ? oldEditor : valueItem.value ? activeUser : null;
      if (item.element === "Signature2") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.isSigned ? activeUser : null;
      } else if (item.element === "DataSource" && ref.state.searchText) {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.value ? activeUser : null;
      } else if (item.element === "FileUpload") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.fileList && valueItem.value.fileList.length > 0 ? activeUser : null;
      } else if (item.element === "ImageUpload") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.filePath ? activeUser : null;
      } else if (item.element === "Table") {
        itemData.editor = oldEditor ? oldEditor : valueItem.value.find(function (itemRow) {
          return itemRow.find(function (val) {
            return !!val;
          });
        }) ? activeUser : null;
      }
    }
    return itemData;
  }
  function _collectFormData(data) {
    var formData = [];
    data.forEach(function (item) {
      var item_data = _collect(item);
      if (item_data) {
        formData.push(item_data);
      }
    });
    return formData;
  }
  function _collectFormItems(data) {
    var formData = [];
    data.forEach(function (item) {
      var itemValue = _collect(item);
      var itemData = {
        id: item.id,
        element: item.element,
        value: itemValue && itemValue.value
      };
      formData.push(itemData);
    });
    return formData;
  }
  function _getSignatureImg(item) {
    var ref = inputsRef.current[item.field_name];
    var $canvas_sig = ref.canvas.current;
    if ($canvas_sig) {
      var base64 = $canvas_sig.toDataURL().replace("data:image/png;base64,", "");
      var isEmpty = $canvas_sig.isEmpty();
      var $input_sig = _reactDom["default"].findDOMNode(ref.inputField.current);
      if (isEmpty) {
        $input_sig.value = "";
      } else {
        $input_sig.value = base64;
      }
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (props.onSubmit) {
      var errors = [];
      if (!props.skip_validations) {
        errors = validateForm();
        props.emitter.emit("formValidation", errors);
      }
      if (errors.length < 1) {
        var data = _collectFormData(props.data);
        props.onSubmit(data);
      }
    } else {
      var _errors = [];
      if (!props.skip_validations) {
        _errors = validateForm();
        props.emitter.emit("formValidation", _errors);
      }
      if (_errors.length < 1) {
        var $form = formRef.current;
        $form.submit();
      }
    }
  }
  function validateForm() {
    var errors = [];
    var data_items = props.data;
    var orderedItems = [];
    props.data.forEach(function (item) {
      var childItems = props.data.filter(function (child) {
        return child.parentId === item.id;
      });
      if (childItems.length > 0) {
        orderedItems = orderedItems.concat(childItems);
      } else if (!item.parentId) {
        orderedItems.push(item);
      }
    });
    var formItems = _collectFormItems(orderedItems);
    var sectionItems = formItems.filter(function (item) {
      return item.element === "Section";
    });
    if (sectionItems.length > 0) {
      var firstItem = formItems[0];
      var activeSectionKey = firstItem.element === "Section" ? firstItem.id : "";
      var sectionGroup = {};
      sectionGroup[activeSectionKey] = [];
      formItems.forEach(function (item) {
        if (item.element === "Section") {
          activeSectionKey = item.id;
          sectionGroup[activeSectionKey] = [];
        } else {
          sectionGroup[activeSectionKey].push(item);
        }
      });
      var activeItems = [];
      var reverseKeys = sectionItems.map(function (item) {
        return item.id;
      }).reverse();
      reverseKeys.push("");
      var activeSectionFound = false;
      reverseKeys.forEach(function (key) {
        var items = sectionGroup[key];
        var fillingItems = items;
        if (key && !activeSectionFound) {
          fillingItems = items.find(function (item) {
            return item.element !== "Table" && item.element !== "Dropdown" && (Array.isArray(item.value) && item.value.length > 0 || (0, _typeof2["default"])(item.value) !== "object" && !Array.isArray(item.value) && !!item.value || item.element === "FileUpload" && item.value.fileList && item.value.fileList.length > 0 || item.element === "ImageUpload" && !!item.value.filePath);
          });
          activeSectionFound = !!fillingItems;
        }
        if (fillingItems) {
          activeItems = activeItems.concat(items);
        }
      });
      var itemIds = activeItems.map(function (item) {
        return item.id;
      });
      data_items = props.data.filter(function (item) {
        return itemIds.includes(item.id);
      });
    }
    data_items.forEach(function (item) {
      if (item.element === "Signature") {
        _getSignatureImg(item);
      }
      if (_isInvalid(item)) {
        errors.push("".concat(item.label || item.position, " is required!"));
      }
      if (props.validateForCorrectness && _isIncorrect(item)) {
        errors.push("".concat(item.label, " was answered incorrectly!"));
      }
    });
    return errors;
  }
  function getDataById(id) {
    var data = props.data;
    var item = data.find(function (x) {
      return x.id === id;
    });
    return item;
  }
  function getInputElement(item) {
    if (item.custom) {
      return getCustomElement(item);
    }
    var Input = _formElements["default"][item.element];
    return /*#__PURE__*/_react["default"].createElement(Input, {
      handleChange: handleChange,
      ref: function ref(c) {
        inputsRef.current[item.field_name] = c;
      },
      mutable: true,
      key: "form_".concat(item.id),
      data: item,
      read_only: props.read_only,
      defaultValue: _getDefaultValue(item),
      editor: _getEditor(item),
      getActiveUserProperties: props.getActiveUserProperties,
      getDataSource: props.getDataSource,
      onUploadFile: props.onUploadFile,
      onDownloadFile: props.onDownloadFile,
      onUploadImage: props.onUploadImage,
      getFormSource: props.getFormSource
    });
  }
  function getContainerElement(item, Element) {
    var controls = item.childItems.map(function (x) {
      var currentItem = getDataById(x);
      return x && currentItem ? getInputElement(currentItem) : null;
    });
    return /*#__PURE__*/_react["default"].createElement(Element, {
      key: "form_".concat(item.id)
    }, controls);
  }
  function getCustomElement(item) {
    var customComponent = props.customComponent;
    if (!customComponent || !customComponent[item.field_name]) {
      return null;
    }
    var CustomComponent = customComponent[item.field_name];
    return /*#__PURE__*/_react["default"].createElement(CustomComponent, {
      handleChange: handleChange,
      ref: function ref(c) {
        inputsRef.current[item.field_name] = c;
      },
      mutable: true,
      key: "form_".concat(item.id),
      data: item,
      read_only: props.read_only,
      defaultValue: _getDefaultValue(item),
      editor: _getEditor(item),
      getActiveUserProperties: props.getActiveUserProperties,
      getDataSource: props.getDataSource,
      onUploadFile: props.onUploadFile,
      onDownloadFile: props.onDownloadFile,
      onUploadImage: props.onUploadImage,
      getFormSource: props.getFormSource
    });
  }
  function handleChange(event) {
    var target = event.target;
    var value = target.type === "checkbox" ? target.checked : target.value;
    var name = target.name;
    var newState = {};
    if (value === "-----") {
      value = null;
    }
    if (target.getAttribute("data-sig")) {
      newState["".concat(name, "_sig")] = true;
    }
    newState[name] = value;
    setAnswerData(function (prevState) {
      return _objectSpread(_objectSpread({}, prevState), newState);
    });
  }
  function convert(answerData) {
    if (!answerData || (0, _typeof2["default"])(answerData) !== "object") {
      return {};
    }
    var convertedData = {};
    Object.keys(answerData).forEach(function (key) {
      if (key.includes("_sig")) {
        return;
      }
      convertedData[key] = answerData[key];
    });
    return convertedData;
  }
  function renderForm() {
    var data = props.data;
    var formControls = data.map(function (item) {
      if (item.parentId) {
        return null;
      }
      if (item.element === "Column") {
        return getContainerElement(item, "div");
      }
      return getInputElement(item);
    });
    return /*#__PURE__*/_react["default"].createElement("form", {
      ref: formRef,
      className: "form-horizontal",
      onSubmit: handleSubmit,
      acceptCharset: "UTF-8",
      encType: "multipart/form-data",
      method: "post",
      autoComplete: "off"
    }, formControls, !props.read_only && /*#__PURE__*/_react["default"].createElement("div", {
      className: "btn-toolbar"
    }, /*#__PURE__*/_react["default"].createElement("button", {
      className: "btn btn-primary",
      type: "submit"
    }, "Submit")));
  }
  return renderForm();
};
ReactForm.defaultProps = {
  validateForCorrectness: false
};
var ReactFormWrapper = function ReactFormWrapper(props) {
  return /*#__PURE__*/_react["default"].createElement(_formContext.FormProvider, null, /*#__PURE__*/_react["default"].createElement(ReactForm, props));
};

// export default ReactFormWrapper;
var _default = function _default() {
  return /*#__PURE__*/_react["default"].createElement("div", null, "test");
};
exports["default"] = _default;