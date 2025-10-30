/**
 * Third-party library re-exports
 * These are re-exported to provide a consistent import interface
 * and potentially allow for future library substitutions
 */
import * as PkgTextAreaAutosize from 'react-textarea-autosize'
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import * as DraftJs from 'draft-js'
import * as draftToHtml from 'draftjs-to-html'

const TextAreaAutosize = (props) => <PkgTextAreaAutosize {...props} />

export { TextAreaAutosize, DraftJs, draftToHtml, Editor }
