import React from 'react'
import ReactDOM from 'react-dom'
import DemoBar from './demobar'
import FormBuilder from './src/index'

// Add our stylesheets for the demo.
require('./scss/application.scss')

const url = '/api/formdata'
const saveUrl = '/api/formdata'

ReactDOM.render(
  <FormBuilder.ReactFormBuilder
    url={url}
    saveUrl={saveUrl}
    onImageUpload={() =>
      'http://www.isocafe.com:8080/VisiforgeDC//temp/formimage/C27E1F69-7C67-4306-8A08-5A783F27F9F3.jpeg'
    }
    onChange={(data) => {
      console.log('form builder elements changed', data)
    }}
  />,
  document.getElementById('form-builder')
)

ReactDOM.render(<DemoBar />, document.getElementById('demo-bar'))
