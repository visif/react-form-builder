/**
 * <HeaderBar />
 */

import React from "react";
import Grip from "../multi-column/grip";

// function HeaderBar(props) {
//   const { data, parent, index, editModeOn, onDestroy, setAsChild } = props;

//   return (
//     <div className="toolbar-header">
//       <span className="badge badge-secondary">{data.text}</span>
//       <div className="toolbar-header-buttons">
//         {data.element !== "LineBreak" && (
//           <div
//             className="btn is-isolated"
//             onClick={editModeOn.bind(parent, data)}
//           >
//             <i className="is-isolated fas fa-edit"></i>
//           </div>
//         )}
//         <div className="btn is-isolated" onClick={onDestroy.bind(null, data)}>
//           <i className="is-isolated fas fa-trash"></i>
//         </div>
//         {!data.isContainer && (
//           <Grip
//             data={data}
//             index={index}
//             onDestroy={onDestroy}
//             setAsChild={setAsChild}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

function HeaderBar(props) {
  const { data, parent, index, editModeOn, onDestroy, setAsChild } = props;

  return (
    <div className="toolbar-header">
      <span className="badge badge-secondary">{data.text}</span>
      <div className="toolbar-header-buttons">
        {data.element !== "LineBreak" && (
          <div
            className="btn is-isolated"
            onClick={editModeOn.bind(parent, data)}
          >
            <i className="is-isolated fas fa-edit"></i>
          </div>
        )}
        <div className="btn is-isolated" onClick={onDestroy.bind(null, data)}>
          <i className="is-isolated fas fa-trash"></i>
        </div>
        {!data.isContainer && (
          <Grip
            data={data}
            index={index}
            onDestroy={onDestroy}
            setAsChild={setAsChild}
          />
        )}
      </div>
    </div>
  );
}

export default HeaderBar;
