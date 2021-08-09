import React, { useState } from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';

const Table = (props) => {
  console.log(props);
  const [ rows, setRows ] = useState(props.rows || 3);
  const [ cols, setCols ] = useState(props.cols || 3);

    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         message: "",
    //         items: []
    //     }
    // }

    // updateMessage(event) {
    //     this.setState({
    //         message: event.target.value
    //     });
    // }

    // handleClick() {
    //     var items = this.state.items;

    //     items.push(this.state.message);

    //     this.setState({
    //         items: items,
    //         message: ""
    //     });
    // }

    // handleItemChanged(i, event) {
    //     var items = this.state.items;
    //     items[i] = event.target.value;

    //     this.setState({
    //         items: items
    //     });
    // }

    // handleItemDeleted(i) {
    //     var items = this.state.items;

    //     items.splice(i, 1);

    //     this.setState({
    //         items: items
    //     });
    // }

    const renderRows = (rows) => {
      if (!rows) {
        return;
      }
      return (
        <tbody>
        {
          Array.from(Array(rows).keys()).map((i) => (
            <tr key={"row" + i}>
            {
              Array.from(Array(cols).keys()).map((j) => (
                <td>
                  <input
                    type="text"
                    value={j}
                    // onChange={context.handleItemChanged.bind(context, i)}
                  />
                </td>
              ))
            }
            </tr>
          ))
        }
        </tbody>
      );
    }

    // const {
    //   controls, data, editModeOn, getDataById, setAsChild, removeChild, seq, className, index,
    // } = props;
    // const { childItems, pageBreakBefore } = data;
    // let baseClasses = 'SortableItem rfb-item';
    // if (pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    let baseClasses = 'SortableItem rfb-item';
    if (props?.data?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...props} />
        <div className="form-group">
          <ComponentLabel {...props} />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Col 1</th>
                <th scope="col">Col 2</th>
                <th scope="col">Col 3</th>
              </tr>
            </thead>
            {renderRows(rows)}
            {/* {childItems.map((x, i) => (
              <div key={`${i}_${x || '_'}`} className={className}>{
                controls ? controls[i] :
                  <Dustbin
                    style={{ width: '100%' }}
                    data={data}
                    accepts={accepts}
                    items={childItems}
                    col={i}
                    parentIndex={index}
                    editModeOn={editModeOn}
                    _onDestroy={() => removeChild(data, i)}
                    getDataById={getDataById}
                    setAsChild={setAsChild}
                    seq={seq}
                  />}
              </div>))} */}
          </table>
        </div>  
      </div>
    );
}

export default Table
