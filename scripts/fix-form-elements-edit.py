#!/usr/bin/env python3
"""
Script to replace all 'this.' references in FormElementsEdit render section
"""
import re

def main():
    file_path = 'src/form-elements-edit.jsx'

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace this.props. → props.
    content = re.sub(r'\bthis\.props\.', 'props.', content)

    # Replace this.state.element → element
    content = re.sub(r'\bthis\.state\.element\b', 'element', content)

    # Replace this.state.formDataSource → formDataSource
    content = re.sub(r'\bthis\.state\.formDataSource\b', 'formDataSource', content)

    # Replace this.state.activeForm → activeForm
    content = re.sub(r'\bthis\.state\.activeForm\b', 'activeForm', content)

    # Replace this.state.editorStates → editorStates
    content = re.sub(r'\bthis\.state\.editorStates\b', 'editorStates', content)

    # Replace this.updateElement → updateElement (remove .bind(this))
    content = re.sub(r'\bthis\.updateElement\.bind\(this\)', 'updateElement', content)
    content = re.sub(r'\bthis\.updateElement\b', 'updateElement', content)

    # Replace this.onEditorStateChange → onEditorStateChange
    content = re.sub(r'\bthis\.onEditorStateChange\b', 'onEditorStateChange', content)

    # Replace this.editElementProp.bind(this, → editElementProp(
    # This is trickier - need to convert from bind pattern to arrow function
    content = re.sub(
        r'onChange=\{this\.editElementProp\.bind\(this, ([\'"])(\w+)\1, ([\'"])(\w+)\3\)\}',
        r'onChange={(e) => editElementProp("\2", "\4", e)}',
        content
    )

    # Replace this.onUploadFile.bind(this) → onUploadFile
    content = re.sub(r'\bthis\.onUploadFile\.bind\(this\)', 'onUploadFile', content)

    # Replace this.getEditorStateFrom → getEditorStateFrom
    content = re.sub(r'\bthis\.getEditorStateFrom\b', 'getEditorStateFrom', content)

    # Remove the closing brace and class declaration artifacts
    # Replace "  }\n}\n\nFormElementsEdit.defaultProps" with just "  )\n}\n\nFormElementsEdit.defaultProps"
    content = re.sub(
        r'(\s+</div>\s+</div>\s+)\)\s+}\s+}\s+FormElementsEdit\.defaultProps',
        r'\1)\n}\n\nFormElementsEdit.defaultProps',
        content
    )

    # Add export default at the end if not present
    if 'export default FormElementsEdit' not in content:
        content = content.rstrip() + '\n\nexport default FormElementsEdit\n'

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ Fixed all 'this.' references in FormElementsEdit")
    print("✅ Converted .bind(this) patterns to arrow functions")
    print("✅ Added export default")

if __name__ == '__main__':
    main()
