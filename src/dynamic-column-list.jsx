/**
 * <DynamicColumnList />
 */

import React from "react";
import ID from "./UUID";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import FormElementsEdit from "./form-elements-edit";

export default class DynamicColumnList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      showEditModal: false,
    };
  }

  _setValue(text) {
    return `${text}`.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
  }

  editColumn(index, key, e) {
    const this_element = this.state.element;
    const val =
      this_element.columns[index].value !==
      this._setValue(this_element.columns[index][key])
        ? this_element.columns[index].value
        : this._setValue(e.target.value);

    this_element.columns[index][key] = e.target.value;
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
    this_element.columns.splice(index + 1, 0, {
      value: "",
      text: "",
      key: ID.uuid(),
      width: 1,
    });
    this.props.updateElement.call(this.props.preview, this_element);
  }

  removeColumn(index) {
    const this_element = this.state.element;
    this_element.columns.splice(index, 1);
    this.props.updateElement.call(this.props.preview, this_element);
  }

  popoverContent = (index) => {
    return (
      <OverlayTrigger
        trigger="click"
        placement="right"
        rootClose={true}
        overlay={
          <Popover
            id="popover-positioned-right"
            title="Column Type"
            style={{ zIndex: 2100, padding: 20 }}
          >
            <div>
              <h3>Select</h3>
              <section>
                <form>
                  <div
                    key="forTextInput"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      id="forTextInput"
                      type="radio"
                      name="option"
                      value="textInput"
                      style={{ marginRight: 5 }}
                    />
                    <label htmlFor="forTextInput" style={{ margin: 0 }}>
                      {" "}
                      Text Input
                    </label>
                    <div
                      className="btn is-isolated"
                      onClick={() => {
                        this.showEditFormClicked();
                      }}
                    >
                      <i className="is-isolated fas fa-edit"></i>
                    </div>
                  </div>
                  <div
                    key="forDropdown"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      id="forDropdown"
                      type="radio"
                      name="option"
                      value="dropdown"
                      style={{ marginRight: 5 }}
                    />
                    <label htmlFor="forDropdown" style={{ margin: 0 }}>
                      {" "}
                      Dropdown
                    </label>
                    <div
                      className="btn is-isolated"
                      onClick={() => {
                        this.showEditFormClicked();
                      }}
                    >
                      <i className="is-isolated fas fa-edit"></i>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </Popover>
        }
      >
        <i class="fa fa-cog" style={{ fontSize: 24, cursor: "pointer" }}></i>
      </OverlayTrigger>
    );
  };

  handleUpdateElement = (element) => {};

  showEditForm() {
    const formElementEditProps = {
      showCorrectColumn: this.props.showCorrectColumn,
      files: this.props.files,
      manualEditModeOff: this.manualEditModeOff,
      preview: this,
      element: {
        text: "xxx",
      },
      updateElement: this.handleUpdateElement,
      getFormSource: this.props.getFormSource,
      getFormContent: this.props.getFormContent,
    };

    return (
      <div
        className="clearfix"
        style={{ margin: "10px", width: "70%", backgroundColor: "red" }}
        id="edit-form-table"
      >
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                <FormElementsEdit {...formElementEditProps} />
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    onClick={() => {}}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  showEditFormClicked = () => {
    this.setState((currentState) => {
      return {
        ...currentState,
        showEditModal: !currentState.showEditModal,
      };
    });
  };

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true;
    }

    return (
      <>
        <div className="dynamic-option-list">
          <ul>
            <li key="header0">
              <div className="row">
                <div className="col-sm-12">
                  <b>Columns</b>
                </div>
              </div>
            </li>
            <li className="clearfix" key="header">
              <div className="row">
                <div className="col-sm-6">Header Text</div>
                <div className="col-sm-2">Width</div>
                <div className="col-sm-1">Type</div>
                <div className="col-sm-3"></div>
              </div>
            </li>
            {this.props.element.columns.map((option, index) => {
              const this_key = `edit_${option.key}`;
              const val =
                option.value !== this._setValue(option.text)
                  ? option.value
                  : "";
              return (
                <>
                  <li className="clearfix" key={this_key}>
                    <div className="row">
                      <div className="col-sm-6" key="1">
                        <input
                          tabIndex={index + 1}
                          className="form-control"
                          style={{ width: "100%" }}
                          type="text"
                          name={`text_${index}`}
                          placeholder="Option text"
                          value={option.text}
                          onBlur={this.updateColumn.bind(this)}
                          onChange={this.editColumn.bind(this, index, "text")}
                        />
                      </div>
                      <div className="col-sm-2" key="2">
                        <input
                          tabIndex={index + 1}
                          className="form-control"
                          style={{ width: "100%" }}
                          type="text"
                          name={`text_${index}`}
                          placeholder="Width"
                          value={option.width}
                          onBlur={this.updateColumn.bind(this)}
                          onChange={this.editColumn.bind(this, index, "width")}
                        />
                      </div>
                      <div className="col-sm-1" key="3">
                        {this.popoverContent(index)}
                      </div>
                      <div className="col-sm-3" key="4">
                        <div className="dynamic-options-actions-buttons">
                          <button
                            onClick={this.addColumn.bind(this, index)}
                            className="btn btn-success"
                          >
                            <i className="fas fa-plus-circle"></i>
                          </button>
                          {index > 0 && (
                            <button
                              onClick={this.removeColumn.bind(this, index)}
                              className="btn btn-danger"
                            >
                              <i className="fas fa-minus-circle"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        {this.state.showEditModal && this.showEditForm()}
      </>
    );
  }
}
