# API Documentation

Complete API reference for react-form-builder2 v1.0.0+

## Table of Contents

- [Components](#components)
  - [ReactFormBuilder](#reactformbuilder)
  - [ReactFormGenerator](#reactformgenerator)
  - [Toolbar](#toolbar)
- [Form Elements](#form-elements)
- [Prop Types](#prop-types)
- [Events & Callbacks](#events--callbacks)
- [Custom Components](#custom-components)
- [Hooks API](#hooks-api)

---

## Components

### ReactFormBuilder

Main form builder component with drag-and-drop interface.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | `undefined` | URL to load initial form data (GET) |
| `saveUrl` | `string` | `undefined` | URL to save form data (POST) |
| `onLoad` | `function` | `undefined` | Callback when form data is loaded |
| `onPost` | `function` | `undefined` | Callback when form is saved |
| `onChange` | `function` | `undefined` | Callback when form data changes |
| `onSubmit` | `function` | `undefined` | Custom submit handler (overrides POST) |
| `data` | `array` | `[]` | Initial form data |
| `toolbarItems` | `array` | `undefined` | Custom toolbar items |
| `customToolbarItems` | `array` | `[]` | Additional custom items |
| `show_description` | `boolean` | `true` | Show element descriptions |
| `editMode` | `boolean` | `false` | Start in edit mode |
| `editElement` | `object` | `null` | Element to edit initially |
| `locale` | `string` | `'en'` | Locale for i18n |
| `files` | `array` | `[]` | File upload configuration |
| `renderEditForm` | `function` | `undefined` | Custom edit form renderer |

#### Usage

```javascript
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

function App() {
  const handleSubmit = (data) => {
    console.log('Form saved:', data);
  };

  return (
    <ReactFormBuilder
      url="/api/forms/initial"
      saveUrl="/api/forms/save"
      onSubmit={handleSubmit}
      show_description={true}
    />
  );
}
```

---

### ReactFormGenerator

Renders forms from JSON data structure.

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | `array` | - | ✅ | Form structure data |
| `form_action` | `string` | `''` | ❌ | Form submission URL |
| `form_method` | `string` | `'POST'` | ❌ | HTTP method |
| `action_name` | `string` | `'Submit'` | ❌ | Submit button text |
| `back_action` | `string` | `''` | ❌ | Cancel button URL |
| `back_name` | `string` | `'Cancel'` | ❌ | Cancel button text |
| `onSubmit` | `function` | `undefined` | ❌ | Custom submit handler |
| `answer_data` | `array` | `[]` | ❌ | Pre-existing answers |
| `task_id` | `number` | `undefined` | ❌ | Hidden task ID |
| `authenticity_token` | `string` | `''` | ❌ | CSRF token (Rails) |
| `hide_actions` | `boolean` | `false` | ❌ | Hide submit/cancel buttons |
| `skip_validations` | `boolean` | `false` | ❌ | Skip validation |
| `display_short` | `boolean` | `false` | ❌ | Show only critical fields |
| `read_only` | `boolean` | `false` | ❌ | Read-only mode |
| `variables` | `object` | `{}` | ❌ | Variables for signatures |
| `submitButton` | `element` | `undefined` | ❌ | Custom submit button |
| `onUpdate` | `function` | `undefined` | ❌ | Form change callback |

#### Usage

```javascript
import { ReactFormGenerator } from 'react-form-builder2';

function DisplayForm({ formData, answers }) {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    // Process submission
  };

  return (
    <ReactFormGenerator
      data={formData}
      answer_data={answers}
      onSubmit={handleSubmit}
      skip_validations={false}
      read_only={false}
    />
  );
}
```

---

### Toolbar

Draggable form element palette.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `array` | Default items | Toolbar items to display |
| `customItems` | `array` | `[]` | Additional custom items |
| `showDescription` | `boolean` | `false` | Show descriptions |

#### Toolbar Item Structure

```javascript
{
  key: 'ElementKey',           // Unique identifier
  element: 'ElementType',      // Element type
  name: 'Display Name',        // Name shown in toolbar
  icon: 'fa fa-icon',         // FontAwesome icon class
  static: false,              // Is static (non-input) element
  canHaveAnswer: true,        // Can accept answers
  canHaveInfo: false,         // Can have info text
  canReadOnly: true,          // Supports read-only
  type: 'custom',             // 'custom' for custom elements
  component: CustomComponent   // Custom React component
}
```

#### Usage

```javascript
import { Toolbar } from 'react-form-builder2';

const customItems = [
  {
    key: 'CustomRating',
    name: 'Star Rating',
    icon: 'fa fa-star',
    static: false,
    element: 'CustomRating',
    component: StarRatingComponent
  }
];

<Toolbar
  items={customItems}
  showDescription={true}
/>
```

---

## Form Elements

### Available Elements

#### Static Elements
- **Header** - Headings with customizable styles
- **Paragraph** - Text paragraphs with formatting
- **Label** - Text labels with alignment
- **LineBreak** - Horizontal dividers
- **HyperLink** - External links
- **Download** - File download links
- **Section** - Section headers

#### Input Elements
- **TextInput** - Single-line text input
- **NumberInput** - Numeric input with validation
- **TextArea** - Multi-line text input
- **Dropdown** - Select dropdown
- **Checkboxes** - Multiple choice checkboxes
- **RadioButtons** - Single choice radio buttons
- **DatePicker** - Date selection
- **TimePicker** - Time selection
- **Tags** - Tag selection (multi-select)
- **Range** - Slider range input

#### Advanced Elements
- **Signature** - Signature capture (canvas)
- **Signature2** - Role-based signature
- **Rating** - Star rating widget
- **Camera** - Image capture from camera
- **FileUpload** - File upload (single/multiple)
- **ImageUpload** - Image upload with preview
- **Table** - Dynamic table with rows/columns

#### Special Elements
- **FormLink** - Link to another form
- **DataSource** - External data integration
- **CustomElement** - Custom component wrapper

### Element Configuration

Each element can have the following common properties:

```javascript
{
  id: 'unique-id',              // Auto-generated UUID
  element: 'TextInput',         // Element type
  text: 'Field Label',          // Display label
  required: false,              // Is required field
  canHaveAnswer: true,          // Can accept answer
  field_name: 'field_name',     // Field name for submission
  label: 'Label text',          // Label text

  // Optional properties
  placeholder: '',              // Placeholder text
  description: '',              // Help text
  defaultValue: '',             // Default value
  readOnly: false,              // Read-only mode
  disabled: false,              // Disabled state

  // Validation
  min_value: undefined,         // Minimum value (numbers)
  max_value: undefined,         // Maximum value (numbers)
  step: undefined,              // Step increment (numbers/range)

  // Styling
  bold: false,                  // Bold text
  italic: false,                // Italic text
  className: '',                // Custom CSS class

  // Layout
  col_width: undefined,         // Column width (multi-column)
  inline: false,                // Inline layout
}
```

---

## Prop Types

All major components include PropTypes validation for type safety.

### ReactFormBuilder PropTypes

```javascript
ReactFormBuilder.propTypes = {
  url: PropTypes.string,
  saveUrl: PropTypes.string,
  onLoad: PropTypes.func,
  onPost: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  toolbarItems: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    element: PropTypes.string,
  })),
  customToolbarItems: PropTypes.arrayOf(PropTypes.object),
  show_description: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.object),
  renderEditForm: PropTypes.func,
  // ... additional props
}
```

---

## Events & Callbacks

### onChange

Called when form data changes in the builder.

```javascript
const handleChange = (data) => {
  console.log('Form data changed:', data);
  // data is array of form elements
};

<ReactFormBuilder onChange={handleChange} />
```

### onSubmit

Called when form is submitted. Overrides default POST behavior.

```javascript
const handleSubmit = (data) => {
  console.log('Form submitted:', data);
  return fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

<ReactFormBuilder onSubmit={handleSubmit} />
```

### onLoad

Called when form data is loaded from URL.

```javascript
const handleLoad = (data) => {
  console.log('Form loaded:', data);
};

<ReactFormBuilder url="/api/form" onLoad={handleLoad} />
```

### onUpdate (Generator)

Called when form fields are updated in the generator.

```javascript
const handleUpdate = (data) => {
  console.log('Field updated:', data);
};

<ReactFormGenerator data={formData} onUpdate={handleUpdate} />
```

---

## Custom Components

You can create custom form elements by providing a React component.

### Creating a Custom Element

```javascript
import React from 'react';

const CustomRating = React.forwardRef(({ name, defaultValue, onChange, ...props }, ref) => {
  const [rating, setRating] = React.useState(defaultValue || 0);

  const handleRate = (value) => {
    setRating(value);
    if (onChange) {
      onChange({ target: { name, value } });
    }
  };

  return (
    <div ref={ref} className="custom-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          className={rating >= star ? 'active' : ''}
        >
          ★
        </button>
      ))}
      <input type="hidden" name={name} value={rating} />
    </div>
  );
});

// Register the custom element
const customToolbarItem = {
  key: 'CustomRating',
  name: 'Star Rating',
  icon: 'fa fa-star',
  element: 'CustomRating',
  type: 'custom',
  component: CustomRating,
  forwardRef: true,
  canHaveAnswer: true,
  props: {
    // Default props for your component
  }
};

<ReactFormBuilder customToolbarItems={[customToolbarItem]} />
```

### Custom Element Requirements

1. **Use `React.forwardRef`** if `forwardRef: true`
2. **Accept standard props**: `name`, `defaultValue`, `onChange`, `data`
3. **Render hidden input** for form submission if needed
4. **Handle validation** if `required: true`

---

## Hooks API

As of v1.0.0, 38/40 components use modern React hooks.

### Common Hooks Used

#### useState
```javascript
const [value, setValue] = React.useState(defaultValue);
```

#### useEffect
```javascript
React.useEffect(() => {
  // Setup logic
  return () => {
    // Cleanup logic
  };
}, [dependencies]);
```

#### useCallback
```javascript
const handleChange = React.useCallback((event) => {
  setValue(event.target.value);
}, []);
```

#### useRef
```javascript
const inputRef = React.useRef(null);
// Access: inputRef.current
```

#### useDrag (react-dnd)
```javascript
const [{ isDragging }, drag] = useDrag(() => ({
  type: 'ITEM',
  item: { id, index },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));
```

#### useDrop (react-dnd)
```javascript
const [{ isOver }, drop] = useDrop(() => ({
  accept: 'ITEM',
  drop: (item) => handleDrop(item),
  collect: (monitor) => ({
    isOver: monitor.isOver(),
  }),
}));
```

---

## Migration Notes

### From v0.10.0 to v1.0.0

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed upgrade instructions.

**Key Changes:**
- React 18 required (use `createRoot` API)
- Bootstrap removed (Ant Design used internally)
- react-dnd v16 (hooks-based)
- All components modernized with hooks

---

## TypeScript Support

TypeScript definitions are not yet included but are planned for a future release.

For now, you can create custom type definitions:

```typescript
// types/react-form-builder2.d.ts
declare module 'react-form-builder2' {
  export interface ToolbarItem {
    key: string;
    name: string;
    icon: string;
    element?: string;
    static?: boolean;
    // ... other properties
  }

  export interface FormBuilderProps {
    url?: string;
    saveUrl?: string;
    onSubmit?: (data: any) => void;
    // ... other props
  }

  export const ReactFormBuilder: React.FC<FormBuilderProps>;
  export const ReactFormGenerator: React.FC<any>;
  export const Toolbar: React.FC<any>;
}
```

---

## Examples

See the [examples/](./examples/) directory for complete working examples:

- **CRA** - Create React App integration
- **Next.js** - Server-side rendering
- **UMD** - Standalone usage
- **Custom** - Custom components and API integration

---

## Support

- [GitHub Issues](https://github.com/Kiho/react-form-builder/issues)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Changelog](./CHANGELOG.md)

---

**Last Updated:** v1.0.0-beta.1
**License:** MIT
