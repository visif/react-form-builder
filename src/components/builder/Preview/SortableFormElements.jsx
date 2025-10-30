import BaseFormElements from '../../form-elements/index'
import CustomElement from '../../form-elements/shared/CustomElement'
import PlaceHolder from './FormPlaceHolder'
import {
  DynamicColumnRow,
  FourColumnRow,
  ThreeColumnRow,
  TwoColumnRow,
} from '../../form-elements/layout'
import SortableElement from './SortableElement'

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
  FormLink, // Add FormLink here
} = BaseFormElements

const FormElements = {}

FormElements.Header = SortableElement(Header)
FormElements.Paragraph = SortableElement(Paragraph)
FormElements.Label = SortableElement(Label)
FormElements.LineBreak = SortableElement(LineBreak)
FormElements.TextInput = SortableElement(TextInput)
FormElements.NumberInput = SortableElement(NumberInput)
FormElements.TextArea = SortableElement(TextArea)
FormElements.Dropdown = SortableElement(Dropdown)
FormElements.Signature = SortableElement(Signature)
FormElements.Checkboxes = SortableElement(Checkboxes)
FormElements.DatePicker = SortableElement(DatePicker)
FormElements.RadioButtons = SortableElement(RadioButtons)
FormElements.Image = SortableElement(Image)
FormElements.Rating = SortableElement(Rating)
FormElements.Tags = SortableElement(Tags)
FormElements.HyperLink = SortableElement(HyperLink)
FormElements.Download = SortableElement(Download)
FormElements.Camera = SortableElement(Camera)
FormElements.Range = SortableElement(Range)
FormElements.PlaceHolder = SortableElement(PlaceHolder)
FormElements.TwoColumnRow = SortableElement(TwoColumnRow)
FormElements.ThreeColumnRow = SortableElement(ThreeColumnRow)
FormElements.FourColumnRow = SortableElement(FourColumnRow)
FormElements.DynamicColumnRow = SortableElement(DynamicColumnRow)
FormElements.CustomElement = SortableElement(CustomElement)
FormElements.Table = SortableElement(Table)
FormElements.Section = SortableElement(Section)
FormElements.Signature2 = SortableElement(Signature2)
FormElements.DataSource = SortableElement(DataSource)
FormElements.FileUpload = SortableElement(FileUpload)
FormElements.ImageUpload = SortableElement(ImageUpload)
FormElements.FormulaInput = SortableElement(FormulaInput)
FormElements.FormLink = SortableElement(FormLink) // Add this line to register FormLink

export default FormElements
