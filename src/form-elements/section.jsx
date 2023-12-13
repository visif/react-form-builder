import React from "react";
import ComponentHeader from "./component-header";

const Section = (props) => {
  let baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <h6>{props.data.header}</h6>
      <hr />
    </div>
  );
};

export default Section;
