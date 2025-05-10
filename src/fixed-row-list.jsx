/**
 * <FixedRowList />
 */
import React from 'react'
import ID from './UUID'

export default class FixedRowList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
    }
  }

  _setValue(text) {
    return `${text || ''}`.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
  }

  editRow(index, key, e) {
    const this_element = this.state.element

    // Ensure rowLabels[index] exists
    if (!this_element.rowLabels[index]) {
      this_element.rowLabels[index] = { value: '', text: '', key: ID.uuid() }
    }

    // Safely check if value property differs from the generated value
    const currentValue = this_element.rowLabels[index].value || ''
    const currentKeyValue = this_element.rowLabels[index][key] || ''
    const targetValue = e.target.value || ''

    // If value is already custom (not auto-generated from text), keep it
    // Otherwise, set it to the new auto-generated value
    const val =
      currentValue !== this._setValue(currentKeyValue)
        ? currentValue
        : this._setValue(targetValue)

    // Update the properties
    this_element.rowLabels[index][key] = targetValue
    this_element.rowLabels[index].value = val

    this.setState({
      element: this_element,
      dirty: true,
    })
  }

  updateRow() {
    const this_element = this.state.element
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element)
      this.setState({ dirty: false })
    }
  }

  addRow(index) {
    const this_element = this.state.element
    const newRowIndex = index + 1

    // Add a new row label
    this_element.rowLabels.splice(newRowIndex, 0, { 
      value: '', 
      text: `Row ${this_element.rowLabels.length + 1}`, 
      key: ID.uuid() 
    })

    // Get a reference to the preview component
    const preview = this.props.preview
    
    // Increase the rows count
    const currentRows = Number(this_element.rows || 1)
    this_element.rows = currentRows + 1
    
    // Initialize a new row in childItems if it doesn't exist
    if (!this_element.childItems[newRowIndex]) {
      const columnsCount = this_element.childItems[0] ? this_element.childItems[0].length : 0
      this_element.childItems[newRowIndex] = Array(columnsCount).fill(null)
    }
    
    // If we can access the preview data
    if (preview && preview.state && preview.state.data && typeof preview.getDataById === 'function') {
      const allFormData = [...preview.state.data];
      const newElements = [];
      
      // For each column, create new elements
      const columnCount = this_element.childItems[0] ? this_element.childItems[0].length : 0
      
      for (let col = 0; col < columnCount; col++) {
        // Find a template element
        let templateElement = null;
        
        // Look for existing elements in this column
        for (let row = 0; row < this_element.childItems.length; row++) {
          if (row !== newRowIndex && 
              this_element.childItems[row] && 
              this_element.childItems[row][col]) {
            
            const elementId = this_element.childItems[row][col];
            const element = preview.getDataById(elementId);
            
            if (element) {
              templateElement = element;
              break;
            }
          }
        }
        
        // If we found a template element
        if (templateElement) {
          const elementType = templateElement.element;
          const timestamp = Date.now() + col + newRowIndex;
          
          // Create a new element
          const newElement = {
            element: elementType,
            id: `${elementType}_${timestamp}_${newRowIndex}_${col}`,
            row: newRowIndex,
            col: col,
            parentId: this_element.id,
            hideLabel: true,
            field_name: `${elementType}_${newRowIndex}_${col}_${timestamp}`
          };
          
          // Copy basic properties
          if (templateElement.label) newElement.label = templateElement.label;
          if (templateElement.required !== undefined) newElement.required = templateElement.required;
          
          // Handle special element types
          if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
            // Create fresh options with unchecked state
            if (templateElement.options && Array.isArray(templateElement.options)) {
              newElement.options = templateElement.options.map(option => ({
                value: option.value,
                text: option.text,
                key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
                checked: false,
                selected: false
              }));
              newElement.inline = templateElement.inline || false;
            }
          } 
          else if (elementType === 'Dropdown') {
            // Create dropdown options
            if (templateElement.options && Array.isArray(templateElement.options)) {
              newElement.options = templateElement.options.map(option => ({
                value: option.value,
                text: option.text,
                key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`
              }));
            }
          }
          else if (templateElement.options) {
            // Handle other elements with options
            newElement.options = JSON.parse(JSON.stringify(templateElement.options))
              .map(opt => ({
                ...opt,
                key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`
              }));
          }
          
          // Add to our collection
          newElements.push(newElement);
          this_element.childItems[newRowIndex][col] = newElement.id;
        }
      }
      
      // If we created new elements, update the form data
      if (newElements.length > 0) {
        const updatedData = [...allFormData, ...newElements];
        
        // Try to update state
        try {
          preview.setState({ data: updatedData }, () => {
            this.props.updateElement.call(preview, this_element);
          });
        } catch (e) {
          console.error("Error updating state:", e);
          this.props.updateElement.call(preview, this_element);
        }
      } else {
        this.props.updateElement.call(preview, this_element);
      }
    } else {
      // Just update the element if we can't access data
      this.props.updateElement.call(this.props.preview, this_element);
    }
  }

  removeRow(index) {
    const this_element = this.state.element
    
    // Don't allow removing the last row
    if (this_element.rowLabels.length <= 1) {
      console.warn('Cannot remove the last row');
      return;
    }
    
    // Remove the row label
    this_element.rowLabels.splice(index, 1)
    
    // If we have childItems, also remove the row from there
    if (this_element.childItems && Array.isArray(this_element.childItems)) {
      // Get a reference to the preview component
      const preview = this.props.preview
      let updatedData = preview && preview.state ? [...preview.state.data] : [];
      
      // Track elements to remove
      const elementsToRemove = [];
      
      // Remove the row from childItems
      if (index < this_element.childItems.length) {
        // Find elements in this row to remove them from data
        if (preview && typeof preview.getDataById === 'function') {
          const rowItems = this_element.childItems[index];
          if (rowItems) {
            rowItems.forEach(elementId => {
              if (elementId) {
                const element = preview.getDataById(elementId);
                if (element) {
                  elementsToRemove.push(element);
                }
              }
            });
          }
        }
        
        // Remove the row from childItems
        this_element.childItems.splice(index, 1);
        
        // Update rows count
        this_element.rows = this_element.childItems.length;
        
        // Remove elements from data if we have access to it
        if (preview && preview.state && elementsToRemove.length > 0) {
          updatedData = updatedData.filter(x => !elementsToRemove.includes(x));
          
          // Try to update state
          try {
            preview.setState({ data: updatedData }, () => {
              this.props.updateElement.call(preview, this_element);
            });
            return;
          } catch (e) {
            console.error("Error updating state:", e);
          }
        }
      }
    }
    
    // Update the element
    this.props.updateElement.call(this.props.preview, this_element)
  }

  render() {
    return (
      <div className="dynamic-option-list">
        <ul key="row-labels">
          <li>
            <div className="row">
              <div className="col-sm-12">
                <b>Rows</b>
              </div>
            </div>
          </li>
          <li className="clearfix" key={`li_label_x`}>
            <div className="row">
              <div className="col-sm-9">Row Label</div>
              <div className="col-sm-3">
                <div className="dynamic-options-actions-buttons">
                  <button
                    onClick={this.addRow.bind(this, -1)}
                    className="btn btn-success"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>
          </li>
          {this.props.element.rowLabels.map((option, index) => {
            const this_key = `edit_${option.key}`
            const val = option.value !== this._setValue(option.text) ? option.value : ''

            return (
              <>
                <li className="clearfix" key={`li_label_${this_key}`}>
                  <div className="row">
                    <div className="col-sm-9">
                      <input
                        tabIndex={index + 1}
                        key={`input_label_${this_key}`}
                        className="form-control"
                        style={{ width: '100%' }}
                        type="text"
                        name={`text_${index}`}
                        placeholder="Row Label"
                        value={option.text}
                        onBlur={this.updateRow.bind(this)}
                        onChange={this.editRow.bind(this, index, 'text')}
                      />
                    </div>
                    <div className="col-sm-3">
                      <div className="dynamic-options-actions-buttons">
                        <button
                          onClick={this.addRow.bind(this, index)}
                          className="btn btn-success"
                        >
                          <i className="fas fa-plus-circle"></i>
                        </button>
                        {
                          <button
                            onClick={this.removeRow.bind(this, index)}
                            className="btn btn-danger"
                          >
                            <i className="fas fa-minus-circle"></i>
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                </li>
              </>
            )
          })}
        </ul>
      </div>
    )
  }
}
