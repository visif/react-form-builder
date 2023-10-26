import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { EventEmitter } from "fbemitter";
import FormValidator from "./form-validator";
import FormElements from "./form-elements";
import { TwoColumnRow, ThreeColumnRow, FourColumnRow } from "./multi-column";
import CustomElement from "./form-elements/custom-element";
import Registry from "./stores/registry";
import { FormProvider, useFormContext } from "./context/form-context";

const {
  Image,
  Checkboxes,
  Signature,
  Signature2,
  FileUpload,
  ImageUpload,
  Download,
  Camera,
  DataSource,
} = FormElements;

const convert = (answers) => {
  if (Array.isArray(answers)) {
    const result = {};
    answers.forEach((x) => {
      if (x.name && x.name.indexOf("tags_") > -1) {
        result[x.name] = x.value.map((y) => y.value);
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

const ReactForm = (props) => {
  const formRef = useRef(null);
  const inputsRef = useRef({});
  const [answerData, setAnswerData] = useState(convert(props.answer_data));

  const { formValues } = useFormContext();

  useEffect(() => {
    setAnswerData(convert(props.answer_data));
  }, [props.answer_data]);

  function _getDefaultValue(item) {
    return answerData[item.field_name];
  }

  function _getEditor(item) {
    if (!props.answer_data || !Array.isArray(props.answer_data)) {
      return null;
    }
    const itemAns = props.answer_data.find((x) => x.name === item.field_name);
    return itemAns && itemAns.editor;
  }

  function _optionsDefaultValue(item) {
    const defaultValue = _getDefaultValue(item);
    if (defaultValue) {
      return defaultValue;
    }

    const defaultChecked = [];
    item.options.forEach((option) => {
      if (answerData[`option_${option.key}`]) {
        defaultChecked.push(option.key);
      }
    });
    return defaultChecked;
  }

  function _getItemValue(item, ref) {
    let $item = {
      element: item.element,
      value: ref && ref.value,
    };
    if (item.element === "Rating") {
      $item.value = ref.state.rating;
    } else if (item.element === "Tags") {
      $item.value = ref.state.value;
    } else if (item.element === "DatePicker") {
      $item.value = ref.input.value;
    } else if (item.element === "Camera") {
      $item.value = ref.src
        ? ref.src.replace("data:image/png;base64,", "")
        : "";
    } else if (item.element === "Table") {
      $item.value = ref.state.inputs;
    } else if (item.element === "Signature2") {
      const dataVal = formValues[item.field_name]?.value || {};
      if (dataVal.isSigned) {
        $item.value = dataVal;
      }
    } else if (item.element === "DataSource" && ref.state.searchText) {
      $item.value = {
        type: ref.props.data.sourceType,
        value: ref.state.searchText,
        selectedItem: ref.state.selectedItem,
      };
    } else if (item.element === "FileUpload") {
      $item.value = {
        fileList: ref.state.fileList,
      };
    } else if (item.element === "ImageUpload") {
      $item.value = {
        filePath: ref.state.filePath,
        fileName: ref.state.fileName,
        blobUrl: ref.state.blobUrl,
      };
    } else if (ref && ref.inputField && ref.inputField.current) {
      $item = ReactDOM.findDOMNode(ref.inputField.current);
      if ($item && typeof $item.value === "string") {
        $item.value = $item.value.trim();
      }
    }

    return $item;
  }

  function _isIncorrect(item) {
    let incorrect = false;
    if (item.canHaveAnswer) {
      const ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        item.options.forEach((option) => {
          const $option = ReactDOM.findDOMNode(
            ref.options[`child_ref_${option.key}`]
          );
          if (
            (option.hasOwnProperty("correct") && !$option.checked) ||
            (!option.hasOwnProperty("correct") && $option.checked)
          ) {
            incorrect = true;
          }
        });
      } else {
        const $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value.toString() !== item.correct) {
            incorrect = true;
          }
        } else if (
          $item.value.toLowerCase() !== item.correct.trim().toLowerCase()
        ) {
          incorrect = true;
        }
      }
    }
    return incorrect;
  }

  function _isInvalid(item) {
    let invalid = false;
    if (item.required === true) {
      const ref = inputsRef.current[item.field_name];
      if (item.element === "Checkboxes" || item.element === "RadioButtons") {
        let checked_options = 0;
        item.options.forEach((option) => {
          const $option = ReactDOM.findDOMNode(
            ref.options[`child_ref_${option.key}`]
          );
          if ($option.checked) {
            checked_options += 1;
          }
        });
        if (checked_options < 1) {
          invalid = true;
        }
      } else {
        const $item = _getItemValue(item, ref);
        if (item.element === "Rating") {
          if ($item.value === 0) {
            invalid = true;
          }
        } else if (
          $item.element === "FileUpload" &&
          (!$item.value.fileList || $item.value.fileList.length <= 0)
        ) {
          invalid = true;
        } else if (item.element === "ImageUpload" && !item.value.filePath) {
          invalid = true;
        } else if (
          $item.value === undefined ||
          $item.value === null ||
          $item.value.length < 1
        ) {
          invalid = true;
        }
      }
    }
    return invalid;
  }

  function _collect(item) {
    const itemData = {
      name: item.field_name,
      custom_name: item.custom_name || item.field_name,
    };
    const ref = inputsRef.current[item.field_name];
    const activeUser = props.getActiveUserProperties();
    const oldEditor = _getEditor(item);

    if (item.element === "Checkboxes" || item.element === "RadioButtons") {
      const dataVal =
        (formValues[item.field_name] && formValues[item.field_name].value) ||
        [];

      itemData.value = dataVal;
      itemData.editor = oldEditor
        ? oldEditor
        : dataVal.length > 0
        ? activeUser
        : null;
    } else if (item.element === "FileUpload") {
      itemData.value = formValues[item.field_name] || [];
      itemData.editor = oldEditor
        ? oldEditor
        : itemData.value > 0
        ? activeUser
        : null;
    } else if (item.element === "Signature2") {
      itemData.value = formValues[item.field_name] || {};
      itemData.editor = oldEditor
        ? oldEditor
        : itemData.value.isSigned
        ? activeUser
        : null;
    } else {
      if (!ref) {
        return null;
      }

      const valueItem = _getItemValue(item, ref);

      itemData.value = valueItem.value;
      itemData.editor = oldEditor
        ? oldEditor
        : valueItem.value
        ? activeUser
        : null;
      if (item.element === "Signature2") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.isSigned
          ? activeUser
          : null;
      } else if (item.element === "DataSource" && ref.state.searchText) {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.value
          ? activeUser
          : null;
      } else if (item.element === "FileUpload") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.fileList && valueItem.value.fileList.length > 0
          ? activeUser
          : null;
      } else if (item.element === "ImageUpload") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.filePath
          ? activeUser
          : null;
      } else if (item.element === "Table") {
        itemData.editor = oldEditor
          ? oldEditor
          : valueItem.value.find((itemRow) => itemRow.find((val) => !!val))
          ? activeUser
          : null;
      }
    }

    return itemData;
  }

  function _collectFormData(data) {
    const formData = [];
    data.forEach((item) => {
      const item_data = _collect(item);
      if (item_data) {
        formData.push(item_data);
      }
    });
    return formData;
  }

  function _collectFormItems(data) {
    const formData = [];
    data.forEach((item) => {
      const itemValue = _collect(item);
      const itemData = {
        id: item.id,
        element: item.element,
        value: itemValue && itemValue.value,
      };

      formData.push(itemData);
    });

    return formData;
  }

  function _getSignatureImg(item) {
    const ref = inputsRef.current[item.field_name];
    const $canvas_sig = ref.canvas.current;
    if ($canvas_sig) {
      const base64 = $canvas_sig
        .toDataURL()
        .replace("data:image/png;base64,", "");
      const isEmpty = $canvas_sig.isEmpty();
      const $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
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
      let errors = [];
      if (!props.skip_validations) {
        errors = validateForm();
        props.emitter.emit("formValidation", errors);
      }

      if (errors.length < 1) {
        const data = _collectFormData(props.data);
        props.onSubmit(data);
      }
    } else {
      let errors = [];
      if (!props.skip_validations) {
        errors = validateForm();
        props.emitter.emit("formValidation", errors);
      }

      if (errors.length < 1) {
        const $form = formRef.current;
        $form.submit();
      }
    }
  }

  function validateForm() {
    const errors = [];
    let data_items = props.data;

    let orderedItems = [];
    props.data.forEach((item) => {
      const childItems = props.data.filter(
        (child) => child.parentId === item.id
      );
      if (childItems.length > 0) {
        orderedItems = orderedItems.concat(childItems);
      } else if (!item.parentId) {
        orderedItems.push(item);
      }
    });

    const formItems = _collectFormItems(orderedItems);
    const sectionItems = formItems.filter((item) => item.element === "Section");

    if (sectionItems.length > 0) {
      const firstItem = formItems[0];
      let activeSectionKey =
        firstItem.element === "Section" ? firstItem.id : "";
      const sectionGroup = {};
      sectionGroup[activeSectionKey] = [];

      formItems.forEach((item) => {
        if (item.element === "Section") {
          activeSectionKey = item.id;
          sectionGroup[activeSectionKey] = [];
        } else {
          sectionGroup[activeSectionKey].push(item);
        }
      });

      let activeItems = [];

      const reverseKeys = sectionItems.map((item) => item.id).reverse();
      reverseKeys.push("");
      let activeSectionFound = false;

      reverseKeys.forEach((key) => {
        const items = sectionGroup[key];
        let fillingItems = items;

        if (key && !activeSectionFound) {
          fillingItems = items.find(
            (item) =>
              item.element !== "Table" &&
              item.element !== "Dropdown" &&
              ((Array.isArray(item.value) && item.value.length > 0) ||
                (typeof item.value !== "object" &&
                  !Array.isArray(item.value) &&
                  !!item.value) ||
                (item.element === "FileUpload" &&
                  item.value.fileList &&
                  item.value.fileList.length > 0) ||
                (item.element === "ImageUpload" && !!item.value.filePath))
          );

          activeSectionFound = !!fillingItems;
        }

        if (fillingItems) {
          activeItems = activeItems.concat(items);
        }
      });

      const itemIds = activeItems.map((item) => item.id);
      data_items = props.data.filter((item) => itemIds.includes(item.id));
    }

    data_items.forEach((item) => {
      if (item.element === "Signature") {
        _getSignatureImg(item);
      }

      if (_isInvalid(item)) {
        errors.push(`${item.label || item.position} is required!`);
      }

      if (props.validateForCorrectness && _isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`);
      }
    });

    return errors;
  }

  function getDataById(id) {
    const { data } = props;
    const item = data.find((x) => x.id === id);
    return item;
  }

  function getInputElement(item) {
    if (item.custom) {
      return getCustomElement(item);
    }
    const Input = FormElements[item.element];
    return (
      <Input
        handleChange={handleChange}
        ref={(c) => {
          inputsRef.current[item.field_name] = c;
        }}
        mutable={true}
        key={`form_${item.id}`}
        data={item}
        read_only={props.read_only}
        defaultValue={_getDefaultValue(item)}
        editor={_getEditor(item)}
        getActiveUserProperties={props.getActiveUserProperties}
        getDataSource={props.getDataSource}
        onUploadFile={props.onUploadFile}
        onDownloadFile={props.onDownloadFile}
        onUploadImage={props.onUploadImage}
        getFormSource={props.getFormSource}
      />
    );
  }

  function getContainerElement(item, Element) {
    const controls = item.childItems.map((x) => {
      const currentItem = getDataById(x);
      return x && currentItem ? getInputElement(currentItem) : null;
    });

    return <Element key={`form_${item.id}`}>{controls}</Element>;
  }

  function getCustomElement(item) {
    const { customComponent } = props;
    if (!customComponent || !customComponent[item.field_name]) {
      return null;
    }
    const CustomComponent = customComponent[item.field_name];
    return (
      <CustomComponent
        handleChange={handleChange}
        ref={(c) => {
          inputsRef.current[item.field_name] = c;
        }}
        mutable={true}
        key={`form_${item.id}`}
        data={item}
        read_only={props.read_only}
        defaultValue={_getDefaultValue(item)}
        editor={_getEditor(item)}
        getActiveUserProperties={props.getActiveUserProperties}
        getDataSource={props.getDataSource}
        onUploadFile={props.onUploadFile}
        onDownloadFile={props.onDownloadFile}
        onUploadImage={props.onUploadImage}
        getFormSource={props.getFormSource}
      />
    );
  }

  function handleChange(event) {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    let newState = {};

    if (value === "-----") {
      value = null;
    }

    if (target.getAttribute("data-sig")) {
      newState[`${name}_sig`] = true;
    }

    newState[name] = value;
    setAnswerData((prevState) => ({
      ...prevState,
      ...newState,
    }));
  }

  function convert(answerData) {
    if (!answerData || typeof answerData !== "object") {
      return {};
    }
    const convertedData = {};
    Object.keys(answerData).forEach((key) => {
      if (key.includes("_sig")) {
        return;
      }
      convertedData[key] = answerData[key];
    });
    return convertedData;
  }

  function renderForm() {
    const { data } = props;
    const formControls = data.map((item) => {
      if (item.parentId) {
        return null;
      }
      if (item.element === "Column") {
        return getContainerElement(item, "div");
      }
      return getInputElement(item);
    });

    return (
      <form
        ref={formRef}
        className="form-horizontal"
        onSubmit={handleSubmit}
        acceptCharset="UTF-8"
        encType="multipart/form-data"
        method="post"
        autoComplete="off"
      >
        {formControls}
        {!props.read_only && (
          <div className="btn-toolbar">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        )}
      </form>
    );
  }

  return renderForm();
};

ReactForm.defaultProps = { validateForCorrectness: false };

const ReactFormWrapper = (props) => {
  return (
    <FormProvider>
      <ReactForm {...props} />
    </FormProvider>
  );
};

// export default ReactFormWrapper;
export default () => <div>test</div>;
