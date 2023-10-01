import React from "react";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";
import FormElements from "../form-elements";

const { Checkboxes } = FormElements || {};

export default class Table extends React.Component {
  self = this;
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    const rowsAdded =
      (props.defaultValue
        ? props.defaultValue.length
        : Number(props.data.rows)) - Number(props.data.rows);
    this.state = {
      rows: Number(props.data.rows),
      rowLabels: props.data.rowLabels,
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(
        props.defaultValue,
        props.data.columns,
        Number(props.data.rows),
        rowsAdded,
        props.data.rowLabels
      ),
      rowsAdded,
    };
  }

  static getInputValues = (
    defaultValue = [],
    columns,
    rows,
    addingRows,
    rowLabels
  ) => {
    const result = [];
    const isFixedRow = rowLabels?.length > 0;
    const activeRows = isFixedRow ? rowLabels?.length : rows + addingRows;
    Array.from(Array(Number(activeRows)).keys()).map((i) => {
      const current = [];
      columns.map((j, jIndex) => {
        let value = defaultValue[i] ? defaultValue[i][jIndex] ?? "" : "";
        if (isFixedRow && jIndex === 0) {
          value = rowLabels[i].text;
        }
        current.push(value);
      });
      result.push(current);
    });

    return result;
  };

  static getDerivedStateFromProps = (props, state) => {
    console.log("Table getDerivedStateFromProps");
    if (
      Number(props.data.rows) !== Number(state.rows) ||
      JSON.stringify(props.data.columns) !== JSON.stringify(state.columns) ||
      JSON.stringify(state.rowLabels) !== JSON.stringify(props.data.rowLabels)
    ) {
      console.log("Table default columns/rows changed");
      return {
        rows: Number(props.data.rows),
        columns: props.data.columns,
        defaultValue: state.defaultValue,
        inputs: Table.getInputValues(
          state.inputs,
          props.data.columns,
          Number(props.data.rows),
          state.rowsAdded,
          props.data.rowLabels
        ),
        rowsAdded: state.rowsAdded,
        rowLabels: props.data.rowLabels,
      };
    }

    if (
      JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)
    ) {
      console.log(
        "Table default prop changed",
        state.defaultValue,
        props.defaultValue
      );
      const rowsAdded =
        (props.defaultValue
          ? props.defaultValue.length
          : Number(props.data.rows)) - Number(props.data.rows);
      return {
        rows: Number(props.data.rows),
        columns: props.data.columns,
        defaultValue: props.defaultValue,
        inputs: Table.getInputValues(
          props.defaultValue,
          props.data.columns,
          Number(props.data.rows),
          rowsAdded,
          props.data.rowLabels
        ),
        rowsAdded,
        rowLabels: props.data.rowLabels,
      };
    }

    return state;
  };

  addRow = () => {
    this.setState((current) => ({
      ...current,
      rowsAdded: current.rowsAdded + 1,
      inputs: Table.getInputValues(
        current.inputs,
        current.columns,
        current.rows,
        current.rowsAdded + 1
      ),
    }));
  };

  removeRow = () => {
    this.setState((current) => ({
      ...current,
      rowsAdded: current.rowsAdded - 1,
      inputs: Table.getInputValues(
        current.inputs,
        current.columns,
        current.rows,
        current.rowsAdded - 1
      ),
    }));
  };

  renderRows = () => {
    const userProperties =
      this.props.getActiveUserProperties &&
      this.props.getActiveUserProperties();

    const savedEditor = this.props.editor;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId;
    }

    const isFixedRow = this.state.rowLabels?.length > 0;
    const activeRows = isFixedRow
      ? this.state.rowLabels?.length
      : this.state.rows + this.state.rowsAdded;

    return (
      <tbody>
        {Array.from(Array(Number(activeRows)).keys()).map((i) => (
          <tr key={"row" + i}>
            {this.props.data?.columns?.map((j, jIndex) => {
              const isLabel = isFixedRow && jIndex === 0;

              if (isLabel) {
                return (
                  <td>
                    <label>{this.state.rowLabels[i].text}</label>
                  </td>
                );
              }

              const value = this.state.inputs[i]
                ? this.state.inputs[i][jIndex] ?? ""
                : "";

              return (
                <td key={`td${i}${jIndex}`}>
                  {this.getColumnInputType("Dropdown")}
                  {/* <textarea
                    className="form-control"
                    style={
                      isLabel ? { border: 0, backgroundColor: "inherit" } : {}
                    }
                    disabled={isLabel || !isSameEditor}
                    type="text"
                    value={value}
                    rows={1}
                    onChange={(event) => {
                      const value = event.target.value;
                      const array = this.state.inputs;
                      array[i][jIndex] = value;
                      this.setState({
                        inputs: array,
                      });
                    }}
                  /> */}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  getColumnWidth = (totalWidthCount, width) => {
    const currentWidth = parseInt(width) ? Number(width) : 1;
    return `${(currentWidth / totalWidthCount) * 100}%`;
  };

  getInputElement(type) {
    // if (item.custom) {
    //   return this.getCustomElement(item);
    // }
    // const Input = FormElements[item.element];
    const Input = FormElements[type];
    // return null;
    return (
      <Input
        hideHeader
        // handleChange={this.handleChange}
        // mutable={true}
        // key={`form_${item.id}`}
        data={{ options: [] }}
        // defaultValue={this._getDefaultValue(item)}
        // editor={this._getEditor(item)}
        getActiveUserProperties={this.props.getActiveUserProperties}
        getDataSource={this.props.getDataSource}
        onUploadFile={this.props.onUploadFile}
        onDownloadFile={this.props.onDownloadFile}
        onUploadImage={this.props.onUploadImage}
        getFormSource={this.props.getFormSource}
      />
    );
  }

  getColumnInputType = (type) => {
    switch (type) {
      case "Dropdown":
        return this.getInputElement(type);
      case "Checkboxes":
        return (
          <Checkboxes
          // ref={(c) => (this.inputs[item.field_name] = c)}
          // read_only={this.props.read_only}
          // handleChange={this.handleChange}
          // mutable={true}
          // key={`form_${item.id}`}
          // data={item}
          // defaultValue={this._optionsDefaultValue(item)}
          // getActiveUserProperties={this.props.getActiveUserProperties}
          // editor={this._getEditor(item)}
          />
        );
        return (
          <ImageUpload
            ref={(c) => (this.inputs[item.field_name] = c)}
            read_only={this.props.read_only || item.readOnly}
            mutable={true}
            key={`form_${item.id}`}
            data={item}
            defaultValue={this._getDefaultValue(item)}
            onUploadImage={this.props.onUploadImage}
            editor={this._getEditor(item)}
            getActiveUserProperties={this.props.getActiveUserProperties}
          />
        );
      default:
        // return this.getSimpleElement(item);
        return null;
    }
  };

  render() {
    const userProperties =
      this.props.getActiveUserProperties &&
      this.props.getActiveUserProperties();

    const savedEditor = this.props.editor;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props?.data?.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }
    const totalWidthCount = this.props.data?.columns.reduce(
      (previous, current) => {
        return previous + (parseInt(current.width) ? Number(current.width) : 1);
      },
      0
    );
    const isFixedRow = this.state.rowLabels?.length > 0;

    return (
      <div className={baseClasses} key={`table-container-${this.props.id}`}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <table
            className="table table-bordered"
            ref={this.tableRef}
            key={`table-${this.props.id}`}
          >
            <thead>
              <tr>
                {this.props.data?.columns?.map((col) => {
                  return (
                    <th
                      scope="col"
                      style={{
                        width: this.getColumnWidth(totalWidthCount, col.width),
                      }}
                    >
                      {col.text}
                    </th>
                  );
                })}
              </tr>
            </thead>
            {this.renderRows()}
          </table>
          {!isFixedRow && (
            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.removeRow}
                style={{
                  marginRight: 8,
                  display: this.state.inputs.length > 0 ? "initial" : "none",
                }}
                disabled={!isSameEditor}
              >
                Remove Row
              </button>
              <button
                type="button"
                className="btn btn-info"
                disabled={!isSameEditor}
                onClick={this.addRow}
              >
                Add Row
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
