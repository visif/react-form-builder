/* eslint-disable camelcase */
import React from "react";

import ComponentHeader from "../form-elements/component-header";
import ComponentLabel from "../form-elements/component-label";
import Dustbin from "./dustbin";
import ItemTypes from "../ItemTypes";

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

const MultiColumnRow = (props) => {
  const {
    controls,
    data = {}, // Default to an empty object if data is undefined
    editModeOn,
    getDataById,
    setAsChild,
    removeChild,
    seq,
    className,
    index,
  } = props;

  const { childItems = [], pageBreakBefore } = data; // Default childItems to an empty array
  const baseClasses = `SortableItem rfb-item ${
    pageBreakBefore ? "alwaysbreak" : ""
  }`;

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} /> {/* Pass all props to ComponentHeader */}
      <div>
        <ComponentLabel {...props} />{" "}
        {/* Pass data explicitly to ComponentLabel */}
        <div className="row">
          {childItems.map((item, columnIndex) => (
            <div key={`${columnIndex}_${item || "_"}`} className={className}>
              {controls ? (
                controls[columnIndex]
              ) : (
                <Dustbin
                  style={{ width: "100%" }}
                  data={data}
                  accepts={accepts}
                  items={childItems}
                  col={columnIndex}
                  parentIndex={index}
                  editModeOn={editModeOn}
                  _onDestroy={() => removeChild(data, columnIndex)}
                  getDataById={getDataById}
                  setAsChild={setAsChild}
                  seq={seq}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const createColumnRow =
  (defaultClassName, numberOfColumns) =>
  ({ data = {}, class_name, ...rest }) => {
    const className = class_name || defaultClassName;
    if (!data.childItems) {
      data.childItems = Array(numberOfColumns).fill(null);
      data.isContainer = true;
    }
    return <MultiColumnRow {...rest} className={className} data={data} />;
  };

const TwoColumnRow = createColumnRow("col-md-6", 2);
const ThreeColumnRow = createColumnRow("col-md-4", 3);
const FourColumnRow = createColumnRow("col-md-3", 4);

export { TwoColumnRow, ThreeColumnRow, FourColumnRow };
