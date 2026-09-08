"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _formElements = _interopRequireDefault(require("./form-elements"));
var _customElement = _interopRequireDefault(require("./form-elements/custom-element"));
var _formPlaceHolder = _interopRequireDefault(require("./form-place-holder"));
var _multiColumn = require("./multi-column");
var _sortableElement = _interopRequireDefault(require("./sortable-element"));
const {
  Header,
  Paragraph,
  Label,
  LineBreak,
  TextInput,
  NumberInput,
  TextArea,
  Dropdown,
  Checkboxes,
  DatePicker,
  RadioButtons,
  Image,
  Rating,
  Tags,
  Signature,
  Signature2,
  DataSource,
  HyperLink,
  Download,
  Camera,
  Range,
  Table,
  Section,
  FileUpload,
  ImageUpload,
  FormulaInput,
  FormLink // Add FormLink here
} = _formElements.default;
const FormElements = {};
FormElements.Header = (0, _sortableElement.default)(Header);
FormElements.Paragraph = (0, _sortableElement.default)(Paragraph);
FormElements.Label = (0, _sortableElement.default)(Label);
FormElements.LineBreak = (0, _sortableElement.default)(LineBreak);
FormElements.TextInput = (0, _sortableElement.default)(TextInput);
FormElements.NumberInput = (0, _sortableElement.default)(NumberInput);
FormElements.TextArea = (0, _sortableElement.default)(TextArea);
FormElements.Dropdown = (0, _sortableElement.default)(Dropdown);
FormElements.Signature = (0, _sortableElement.default)(Signature);
FormElements.Checkboxes = (0, _sortableElement.default)(Checkboxes);
FormElements.DatePicker = (0, _sortableElement.default)(DatePicker);
FormElements.RadioButtons = (0, _sortableElement.default)(RadioButtons);
FormElements.Image = (0, _sortableElement.default)(Image);
FormElements.Rating = (0, _sortableElement.default)(Rating);
FormElements.Tags = (0, _sortableElement.default)(Tags);
FormElements.HyperLink = (0, _sortableElement.default)(HyperLink);
FormElements.Download = (0, _sortableElement.default)(Download);
FormElements.Camera = (0, _sortableElement.default)(Camera);
FormElements.Range = (0, _sortableElement.default)(Range);
FormElements.PlaceHolder = (0, _sortableElement.default)(_formPlaceHolder.default);
FormElements.TwoColumnRow = (0, _sortableElement.default)(_multiColumn.TwoColumnRow);
FormElements.ThreeColumnRow = (0, _sortableElement.default)(_multiColumn.ThreeColumnRow);
FormElements.FourColumnRow = (0, _sortableElement.default)(_multiColumn.FourColumnRow);
FormElements.DynamicColumnRow = (0, _sortableElement.default)(_multiColumn.DynamicColumnRow);
FormElements.CustomElement = (0, _sortableElement.default)(_customElement.default);
FormElements.Table = (0, _sortableElement.default)(Table);
FormElements.Section = (0, _sortableElement.default)(Section);
FormElements.Signature2 = (0, _sortableElement.default)(Signature2);
FormElements.DataSource = (0, _sortableElement.default)(DataSource);
FormElements.FileUpload = (0, _sortableElement.default)(FileUpload);
FormElements.ImageUpload = (0, _sortableElement.default)(ImageUpload);
FormElements.FormulaInput = (0, _sortableElement.default)(FormulaInput);
FormElements.FormLink = (0, _sortableElement.default)(FormLink); // Add this line to register FormLink
var _default = exports.default = FormElements;