#!/usr/bin/env python3
"""
Convert ReactForm class component to functional component with hooks.
This script performs systematic conversion following the Phase 18 plan.
"""

import re

def convert_form_jsx():
    with open('src/form.jsx', 'r') as f:
        content = f.read()

    # Step 1: Update imports
    content = content.replace(
        "import React from 'react'",
        "import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'"
    )

    # Step 2: Remove @class and @todo from JSDoc
    content = re.sub(r'\n \* @class\n', '\n', content)
    content = re.sub(r' \* @todo.*?\n', '', content)
    content = re.sub(r' \* @note.*?\n', '', content)

    # Step 3: Replace class declaration with functional component
    class_pattern = r'export default class ReactForm extends React\.Component \{[\s\S]*?constructor\(props\) \{[\s\S]*?\n  \}'

    # Find the constructor section to extract initial state logic
    functional_start = '''const ReactForm = (props) => {
  // Refs (replacing class properties)
  const formRef = useRef(null)
  const inputsRef = useRef({})
  const emitterRef = useRef(new EventEmitter())
  const variableSubscriptionRef = useRef(null)

  // State (replacing this.state)
  const [answerData, setAnswerData] = useState(() => convert(props.answer_data))
  const [variables, setVariables] = useState({})'''

    # Replace the class start
    content = re.sub(
        r'export default class ReactForm extends React\.Component \{\n  form\n\n  inputs = \{\}\n\n  constructor\(props\)',
        'const ReactForm = (props)',
        content
    )

    # Remove constructor body up to first method
    content = re.sub(
        r'const ReactForm = \(props\) \{\n    super\(props\)[\s\S]*?  \}\n\n  componentDidMount',
        functional_start + '\n\n  // Lifecycle converted to useEffect below\n  // Original componentDidMount',
        content
    )

    # Step 4: Convert methods to useCallback
    # Convert method declarations
    content = re.sub(r'\n  _(\w+)\((.*?)\) \{', r'\n  const \1 = useCallback((\2) => {', content)
    content = re.sub(r'\n  (\w+)\((.*?)\) \{', r'\n  const \1 = useCallback((\2) => {', content)

    # Step 5: Update this references
    content = content.replace('this.inputs', 'inputsRef.current')
    content = content.replace('this.form', 'formRef.current')
    content = content.replace('this.emitter', 'emitterRef.current')
    content = content.replace('this.props.', 'props.')
    content = content.replace('this.state.answerData', 'answerData')
    content = content.replace('this.state.variables', 'variables')
    content = content.replace('this._', '')  # Remove underscore prefix

    # Step 6: Add closing brackets and dependencies for useCallback
    # This is complex - would need AST parsing for accuracy

    # Step 7: Convert render to return
    content = re.sub(r'  render\(\) \{', '  // Render logic\n  ', content)

    # Step 8: Remove closing class bracket and add default export
    content = re.sub(r'\nReactForm\.defaultProps = \{ validateForCorrectness: false \}\n', '', content)
    content += '\n\nReactForm.defaultProps = { validateForCorrectness: false }\n\nexport default ReactForm\n'

    # Write converted content
    with open('src/form.jsx.converted', 'w') as f:
        f.write(content)

    print("Conversion complete! Review src/form.jsx.converted")
    print("Manual steps still needed:")
    print("1. Add closing brackets and deps for all useCallback")
    print("2. Convert lifecycle methods to useEffect")
    print("3. Fix any remaining 'this' references")
    print("4. Test thoroughly!")

if __name__ == '__main__':
    convert_form_jsx()
