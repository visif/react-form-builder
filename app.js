import React from 'react'
import { createRoot } from 'react-dom/client'
import DemoBar from './demobar'
import FormBuilder from './src/index'

// Add our stylesheets for the demo.
import './scss/application.scss'

const url = '/api/formdata'
const saveUrl = '/api/formdata'

const commonProps = {
  getFormSource: () => [
    {
      id: 1,
      name: 'User Registration Form',
      title: 'User Registration Form',
    },
    { id: 2, name: 'Contact Us Form', title: 'Contact Us Form' },
    { id: 3, name: 'Feedback Form', title: 'Feedback Form' },
    { id: 4, name: 'Survey Form', title: 'Survey Form' },
    { id: 5, name: 'Application Form', title: 'Application Form' },
  ],
}

// React 18: Use createRoot instead of ReactDOM.render
const formBuilderRoot = createRoot(document.getElementById('form-builder'))
formBuilderRoot.render(
  <FormBuilder.ReactFormBuilder
    url={url}
    saveUrl={saveUrl}
    onImageUpload={() => 'http://www.isocafe.com:8080/VisiforgeDC//temp/formimage/C27E1F69-7C67-4306-8A08-5A783F27F9F3.jpeg'}
    onChange={(data) => {
      console.log('form builder elements changed', data)
    }}
    {...commonProps}
  />,
)

const demoBarRoot = createRoot(document.getElementById('demo-bar'))
demoBarRoot.render(<DemoBar {...commonProps} />)
