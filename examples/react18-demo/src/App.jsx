import React from 'react'

import { ReactFormBuilder, ReactFormGenerator } from '../../../dist/app.es.js'

const initialData = [
  {
    id: 'demo_header',
    element: 'Header',
    text: 'Employee Onboarding',
    static: true,
    required: false,
    bold: true,
  },
  {
    id: 'demo_text_input',
    element: 'TextInput',
    text: 'Full Name',
    required: true,
    canHaveAnswer: true,
    canReadOnly: false,
    defaultValue: '',
  },
]

const App = () => {
  const [mode, setMode] = React.useState('builder')
  const [formData, setFormData] = React.useState(initialData)

  return (
    <div className="demo-shell">
      <header className="demo-header">
        <h1>@visif/form-builder Demo (React 18)</h1>
        <p>Using build artifacts from dist/app.es.js and dist/app.css</p>
      </header>

      <div className="demo-actions">
        <button
          type="button"
          className={mode === 'builder' ? 'active' : ''}
          onClick={() => setMode('builder')}
        >
          Builder
        </button>
        <button
          type="button"
          className={mode === 'generator' ? 'active' : ''}
          onClick={() => setMode('generator')}
        >
          Generator
        </button>
      </div>

      <main className="demo-main">
        {mode === 'builder' ? (
          <ReactFormBuilder
            data={formData}
            onPost={(data) => setFormData(data.task_data || data)}
            onChange={(data) => setFormData(data)}
          />
        ) : (
          <div className="generator-wrap">
            <ReactFormGenerator
              data={formData}
              onSubmit={(payload) => {
                // eslint-disable-next-line no-alert
                alert(`Submitted with ${payload.length} answer item(s)`)
              }}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
