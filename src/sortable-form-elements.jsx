import SortableElement from "./sortable-element";
import PlaceHolder from "./form-place-holder";
import BaseFormElements from "./form-elements";
import { TwoColumnRow, ThreeColumnRow, FourColumnRow } from "./multi-column";
import CustomElement from "./form-elements/custom-element";

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
} = BaseFormElements;

const FormElements = {};

FormElements.Header = SortableElement(Header);
FormElements.Paragraph = SortableElement(Paragraph);
FormElements.Label = SortableElement(Label);
FormElements.LineBreak = SortableElement(LineBreak);
FormElements.TextInput = SortableElement(TextInput);
FormElements.NumberInput = SortableElement(NumberInput);
FormElements.TextArea = SortableElement(TextArea);
FormElements.Dropdown = SortableElement(Dropdown);
FormElements.Signature = SortableElement(Signature);
FormElements.Checkboxes = SortableElement(Checkboxes);
FormElements.DatePicker = SortableElement(DatePicker);
FormElements.RadioButtons = SortableElement(RadioButtons);
FormElements.Image = SortableElement(Image);
FormElements.Rating = SortableElement(Rating);
FormElements.Tags = SortableElement(Tags);
FormElements.HyperLink = SortableElement(HyperLink);
FormElements.Download = SortableElement(Download);
FormElements.Camera = SortableElement(Camera);
FormElements.Range = SortableElement(Range);
FormElements.PlaceHolder = SortableElement(PlaceHolder);
FormElements.TwoColumnRow = SortableElement(TwoColumnRow);
FormElements.ThreeColumnRow = SortableElement(ThreeColumnRow);
FormElements.FourColumnRow = SortableElement(FourColumnRow);
FormElements.CustomElement = SortableElement(CustomElement);
FormElements.Table = SortableElement(Table);
FormElements.Section = SortableElement(Section);
FormElements.Signature2 = SortableElement(Signature2);
FormElements.DataSource = SortableElement(DataSource);
FormElements.FileUpload = SortableElement(FileUpload);

export default FormElements;
