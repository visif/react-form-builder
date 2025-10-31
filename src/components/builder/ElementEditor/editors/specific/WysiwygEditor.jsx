import React from 'react'

import { Editor } from 'react-draft-wysiwyg'

/**
 * WYSIWYG editor component for rich text editing
 * Uses Draft.js with customizable toolbar
 */
const WysiwygEditor = ({
  label,
  defaultEditorState,
  editorState,
  onChange,
  onBlur,
  toolbar,
  stripPastedStyles = false,
}) => {
  return (
    <div className="form-group">
      {label && <label className="control-label">{label}</label>}
      <Editor
        toolbar={toolbar}
        defaultEditorState={defaultEditorState}
        editorState={editorState}
        onBlur={onBlur}
        onEditorStateChange={onChange}
        stripPastedStyles={stripPastedStyles}
      />
    </div>
  )
}

export default WysiwygEditor
