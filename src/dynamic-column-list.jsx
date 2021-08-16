/**
  * <DynamicColumnList />
  */

import React from 'react';
import ID from './UUID';

export default class DynamicColumnList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
    };
  }

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
  }

  editColumn(index, e) {
    const this_element = this.state.element;
    const val = (this_element.columns[index].value !== this._setValue(this_element.columns[index].text)) ? 
      this_element.columns[index].value : this._setValue(e.target.value);

    this_element.columns[index].text = e.target.value;
    this_element.columns[index].value = val;
    this.setState({
      element: this_element,
      dirty: true,
    });
  }

  updateColumn() {
    const this_element = this.state.element;
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element);
      this.setState({ dirty: false });
    }
  }

  addColumn(index) {
    const this_element = this.state.element;
    this_element.columns.splice(index + 1, 0, { value: '', text: '', key: ID.uuid() });
    this.props.updateElement.call(this.props.preview, this_element);
  }

  removeColumn(index) {
    const this_element = this.state.element;
    this_element.columns.splice(index, 1);
    this.props.updateElement.call(this.props.preview, this_element);
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true;
    }

    return (
      <div className="dynamic-option-list">
        <ul>
          <li>
            <div className="row">
              <div className="col-sm-9"><b>Column Header Text</b></div>
            </div>
          </li>
          {
            this.props.element.columns.map((option, index) => {
              const this_key = `edit_${option.key}`;
              const val = (option.value !== this._setValue(option.text)) ? option.value : '';
              return (
                <li className="clearfix" key={this_key}>
                  <div className="row">
                    <div className="col-sm-9">
                      <input tabIndex={index + 1} 
                        className="form-control" 
                        style={{ width: '100%' }} type="text" 
                        name={`text_${index}`} placeholder="Option text" 
                        value={option.text} 
                        onBlur={this.updateColumn.bind(this)} 
                        onChange={this.editColumn.bind(this, index)} 
                      />
                    </div>
                    <div className="col-sm-3">
                      <div className="dynamic-options-actions-buttons">
                        <button 
                          onClick={this.addColumn.bind(this, index)} 
                          className="btn btn-success"
                        >
                          <i className="fas fa-plus-circle"></i>
                        </button>
                        { 
                          index > 0 && 
                          <button 
                            onClick={this.removeColumn.bind(this, index)} 
                            className="btn btn-danger"
                          >
                            <i className="fas fa-minus-circle"></i>
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}
