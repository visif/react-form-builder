import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFormBuilder, ReactFormGenerator } from './index';
import '../scss/application.scss';

// Simple dev app to test the form builder
function DevApp() {
  const [formData, setFormData] = React.useState([]);
  const [showPreview, setShowPreview] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState(null);

  const handleFormSubmit = (data) => {
    console.log('Form submitted with data:', data);
    setSubmittedData(data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React Form Builder - Development</h1>

      {/* Toggle Preview Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            setShowPreview(!showPreview);
            // Clear submitted data when switching views
            if (showPreview) {
              setSubmittedData(null);
            }
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: showPreview ? '#dc3545' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showPreview ? '← Back to Builder' : 'Preview Form →'}
        </button>
      </div>

      {!showPreview ? (
        // Form Builder View
        <>
          <div style={{ height: 'calc(100vh - 200px)' }}>
            <ReactFormBuilder
              data={formData}
              onChange={(data) => {
                console.log('Form data changed:', data);
                setFormData(data);
              }}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <h3>Form Data (JSON):</h3>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </>
      ) : (
        // Form Preview/Generator View
        <div>
          <h2>Form Preview</h2>
          {formData.length === 0 ? (
            <p>No form elements yet. Go back to the builder and add some elements.</p>
          ) : (
            <>
              <ReactFormGenerator
                key={showPreview ? 'preview' : 'hidden'}
                data={formData}
                onSubmit={handleFormSubmit}
              />
              {submittedData && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Submitted Data:</h3>
                  <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DevApp />);
