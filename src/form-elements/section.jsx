// import React from 'react';
// import ComponentHeader from './component-header';

// export default class Section extends React.Component {
//   render() {
//     let baseClasses = 'SortableItem rfb-item';
//     if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <h6>{this.props.data.header}</h6>
//         <hr />
//       </div>
//     );
//   }
// }

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
