import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFormBuilder, ReactFormGenerator } from './index';
import '../scss/application.scss';

// Mock sample form data for testing
const SAMPLE_FORM_DATA = [
  {
    id: 'sample-header',
    element: 'Header',
    text: '<h2>Sample Registration Form</h2>',
    static: true,
    bold: false,
    italic: false,
  },
  {
    id: 'sample-paragraph',
    element: 'Paragraph',
    text: '<p>Please fill out all required fields marked with <span style="color: red;">*</span></p>',
    static: true,
  },
  {
    id: 'sample-name',
    element: 'TextInput',
    text: 'Full Name',
    required: true,
    canHaveAnswer: true,
    field_name: 'full_name',
    label: 'Full Name',
  },
  {
    id: 'sample-email',
    element: 'TextInput',
    text: 'Email Address',
    required: true,
    canHaveAnswer: true,
    field_name: 'email',
    label: 'Email Address',
  },
  {
    id: 'sample-dropdown',
    element: 'Dropdown',
    text: 'Country',
    required: true,
    canHaveAnswer: true,
    field_name: 'country',
    label: 'Country',
    options: [
      { value: 'us', text: 'United States', key: 'us' },
      { value: 'uk', text: 'United Kingdom', key: 'uk' },
      { value: 'ca', text: 'Canada', key: 'ca' },
    ],
  },
  {
    id: 'sample-checkbox',
    element: 'Checkboxes',
    text: 'Interests',
    required: false,
    canHaveAnswer: true,
    field_name: 'interests',
    label: 'Interests',
    options: [
      { value: 'tech', text: 'Technology', key: 'tech' },
      { value: 'sports', text: 'Sports', key: 'sports' },
      { value: 'music', text: 'Music', key: 'music' },
    ],
  },
  {
    id: 'sample-textarea',
    element: 'TextArea',
    text: 'Comments',
    required: false,
    canHaveAnswer: true,
    field_name: 'comments',
    label: 'Comments',
  },
];

// Mock answer data for testing pre-population
const SAMPLE_ANSWER_DATA = [
  { name: 'full_name', value: 'John Doe' },
  { name: 'email', value: 'john.doe@example.com' },
  { name: 'country', value: 'us' },
  { name: 'interests', value: ['tech', 'music'] },
];

// Dev app with comprehensive testing features
function DevApp() {
  const [formData, setFormData] = React.useState([]);
  const [showPreview, setShowPreview] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState(null);
  const [answerData, setAnswerData] = React.useState([]);
  const [readOnly, setReadOnly] = React.useState(false);
  const [skipValidations, setSkipValidations] = React.useState(false);
  const [hideActions, setHideActions] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const [builderKey, setBuilderKey] = React.useState(0); // Key to force remount
  const [generatorKey, setGeneratorKey] = React.useState(0); // Key to force generator remount

  // Add log entry
  const addLog = React.useCallback((type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { type, message, data, timestamp }]);
    console.log(`[${type}] ${message}`, data || '');
  }, []);

  // Mock callbacks
  const handleLoad = React.useCallback((data) => {
    addLog('onLoad', 'Form data loaded', data);
  }, [addLog]);

  const handleChange = React.useCallback((data) => {
    addLog('onChange', 'Form data changed', { elementCount: data.length });
    setFormData(data);
  }, [addLog]);

  const handlePost = React.useCallback((data) => {
    addLog('onPost', 'Form saved via POST', data);
    return Promise.resolve({ success: true, message: 'Form saved successfully' });
  }, [addLog]);

  const handleFormSubmit = React.useCallback((data) => {
    addLog('onSubmit', 'Form submitted', data);
    setSubmittedData(data);
    // Simulate async processing
    return new Promise((resolve) => {
      setTimeout(() => {
        addLog('onSubmit', 'Form submission completed');
        resolve({ success: true });
      }, 500);
    });
  }, [addLog]);

  const handleUpdate = React.useCallback((data) => {
    addLog('onUpdate', 'Form field updated', data);
  }, [addLog]);

  // Clear logs
  const clearLogs = React.useCallback(() => {
    setLogs([]);
  }, []);

  // Load sample data
  const loadSampleData = React.useCallback(() => {
    setFormData(SAMPLE_FORM_DATA);
    setBuilderKey(prev => prev + 1); // Force remount
    addLog('info', 'Sample form data loaded', { elementCount: SAMPLE_FORM_DATA.length });
  }, [addLog]);

  // Load sample answers
  const loadSampleAnswers = React.useCallback(() => {
    setAnswerData(SAMPLE_ANSWER_DATA);
    setGeneratorKey(prev => prev + 1); // Force generator remount
    addLog('info', 'Sample answer data loaded', { answerCount: SAMPLE_ANSWER_DATA.length });
  }, [addLog]);

  // Clear form data
  const clearFormData = React.useCallback(() => {
    setFormData([]);
    setSubmittedData(null);
    setBuilderKey(prev => prev + 1); // Force remount
    addLog('info', 'Form data cleared');
  }, [addLog]);

  // Clear answer data
  const clearAnswerData = React.useCallback(() => {
    setAnswerData([]);
    setGeneratorKey(prev => prev + 1); // Force generator remount
    addLog('info', 'Answer data cleared');
  }, [addLog]);

  // Export form data as JSON
  const exportFormData = React.useCallback(() => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'form-data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    addLog('info', 'Form data exported');
  }, [formData, addLog]);

  return (
    <div style={{ padding: '20px', maxWidth: '1800px', margin: '0 auto' }}>
      <h1>React Form Builder - Development & Testing</h1>

      {/* Control Panel */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0 }}>Control Panel</h3>

        {/* Main Actions */}
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => {
              setShowPreview(!showPreview);
              if (showPreview) {
                setSubmittedData(null);
              }
              addLog('info', showPreview ? 'Switched to Builder view' : 'Switched to Preview view');
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: showPreview ? '#dc3545' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {showPreview ? '← Back to Builder' : 'Preview Form →'}
          </button>

          <button
            onClick={loadSampleData}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Load Sample Form
          </button>

          <button
            onClick={clearFormData}
            disabled={formData.length === 0}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: formData.length === 0 ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              opacity: formData.length === 0 ? 0.6 : 1
            }}
          >
            Clear Form
          </button>

          <button
            onClick={exportFormData}
            disabled={formData.length === 0}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: formData.length === 0 ? 'not-allowed' : 'pointer',
              opacity: formData.length === 0 ? 0.6 : 1
            }}
          >
            Export JSON
          </button>
        </div>

        {/* Preview Options */}
        {showPreview && (
          <div style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ marginTop: 0 }}>Preview Options</h4>

            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={readOnly}
                onChange={(e) => {
                  setReadOnly(e.target.checked);
                  addLog('info', `Read-only mode ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                style={{ marginRight: '8px' }}
              />
              Read Only Mode
            </label>

            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={skipValidations}
                onChange={(e) => {
                  setSkipValidations(e.target.checked);
                  addLog('info', `Skip validations ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                style={{ marginRight: '8px' }}
              />
              Skip Validations
            </label>

            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={hideActions}
                onChange={(e) => {
                  setHideActions(e.target.checked);
                  addLog('info', `Hide actions ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                style={{ marginRight: '8px' }}
              />
              Hide Submit/Cancel Buttons
            </label>

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={loadSampleAnswers}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Load Sample Answers
              </button>

              <button
                onClick={clearAnswerData}
                disabled={answerData.length === 0}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: answerData.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: answerData.length === 0 ? 0.6 : 1
                }}
              >
                Clear Answers
              </button>

              {answerData.length > 0 && (
                <span style={{ marginLeft: '10px', color: '#28a745' }}>
                  ✓ {answerData.length} answers loaded
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {!showPreview ? (
            // Form Builder View
            <>
              <div style={{
                height: 'calc(100vh - 400px)',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <ReactFormBuilder
                  key={builderKey}
                  data={formData}
                  onChange={handleChange}
                  onLoad={handleLoad}
                  onPost={handlePost}
                  onSubmit={handleFormSubmit}
                  show_description={true}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <h3>Form Data (JSON) - {formData.length} elements</h3>
                <pre style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '300px',
                  fontSize: '12px'
                }}>
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            // Form Preview/Generator View
            <div>
              <h2>Form Preview/Generator</h2>
              {formData.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ fontSize: '18px', color: '#6c757d' }}>
                    No form elements yet. Go back to the builder and add some elements.
                  </p>
                  <button
                    onClick={loadSampleData}
                    style={{
                      padding: '10px 20px',
                      fontSize: '16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    Load Sample Form
                  </button>
                </div>
              ) : (
                <>
                  <ReactFormGenerator
                    key={`generator-${generatorKey}`}
                    data={formData}
                    answer_data={answerData}
                    onSubmit={handleFormSubmit}
                    onUpdate={handleUpdate}
                    read_only={readOnly}
                    skip_validations={skipValidations}
                    hide_actions={hideActions}
                    action_name="Submit Form"
                    back_name="Reset"
                  />

                  {submittedData && (
                    <div style={{ marginTop: '20px' }}>
                      <h3 style={{ color: '#28a745' }}>✓ Form Submitted Successfully!</h3>
                      <pre style={{
                        backgroundColor: '#d4edda',
                        padding: '10px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        border: '1px solid #c3e6cb'
                      }}>
                        {JSON.stringify(submittedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Event Log Sidebar */}
        <div style={{
          width: '400px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          padding: '15px',
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>Event Log</h3>
            <button
              onClick={clearLogs}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>

          {logs.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No events yet...</p>
          ) : (
            <div>
              {logs.map((log, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    border: '1px solid #dee2e6'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: log.type === 'onSubmit' ? '#28a745' :
                             log.type === 'onChange' ? '#007bff' :
                             log.type === 'info' ? '#6c757d' : '#17a2b8'
                    }}>
                      {log.type}
                    </span>
                    <span style={{ color: '#6c757d', fontSize: '11px' }}>
                      {log.timestamp}
                    </span>
                  </div>
                  <div style={{ color: '#495057' }}>{log.message}</div>
                  {log.data && (
                    <pre style={{
                      marginTop: '4px',
                      fontSize: '10px',
                      backgroundColor: '#f8f9fa',
                      padding: '4px',
                      borderRadius: '2px',
                      overflow: 'auto',
                      maxHeight: '100px'
                    }}>
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DevApp />);
