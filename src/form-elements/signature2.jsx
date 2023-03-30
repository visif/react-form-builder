// import React from "react";
// import ComponentHeader from "./component-header";

// class Signature2 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();

//     this.state = {
//       defaultValue: props.defaultValue && props.defaultValue.isSigned,
//       isSigned: props.defaultValue && props.defaultValue.isSigned,
//       signedPerson: props.defaultValue && props.defaultValue.signedPerson,
//       signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
//       isError: false,
//     };
//   }

//   static getDerivedStateFromProps = (props, state) => {
//     console.log("Signature getDerivedStateFromProps");
//     if (
//       props.defaultValue &&
//       props.defaultValue.isSigned !== state.defaultValue
//     ) {
//       return {
//         defaultValue: props.defaultValue && props.defaultValue.isSigned,
//         isSigned: props.defaultValue && props.defaultValue.isSigned,
//         isError: false,
//         signedPerson: props.defaultValue.signedPerson,
//         signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
//       };
//     }

//     return state;
//   };

//   clickToSign = () => {
//     if (typeof this.props.getActiveUserProperties !== "function") {
//       return;
//     }

//     const userProperties = this.props.getActiveUserProperties();
//     let roleLists = (userProperties && userProperties.role) || [];
//     roleLists = roleLists.concat([
//       (userProperties && userProperties.name) || "",
//     ]);

//     const position = `${this.props.data.position}`.toLocaleLowerCase().trim();

//     if (
//       this.props.data.specificRole === "specific" &&
//       roleLists.find(
//         (item) => `${item}`.toLocaleLowerCase().trim() === position
//       )
//     ) {
//       this.setState((current) => ({
//         ...current,
//         isSigned: !current.isSigned,
//         signedPerson: !current.isSigned ? userProperties.name : "",
//         signedPersonId: !current.isSigned ? userProperties.userId : "",
//       }));
//     } else if (this.props.data.specificRole === "notSpecific") {
//       this.setState((current) => ({
//         ...current,
//         isSigned: !current.isSigned,
//         signedPerson: !current.isSigned ? userProperties.name : "",
//         signedPersonId: !current.isSigned ? userProperties.userId : "",
//       }));
//     } else {
//       if (!this.state.isError) {
//         this.setState({
//           isError: true,
//         });
//         setTimeout(() => {
//           this.setState({
//             isError: false,
//           });
//         }, 5000);
//       }
//       console.log("role annd name does not match");
//     }
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const hasRequiredLabel =
//       this.props.data.hasOwnProperty("required") &&
//       this.props.data.required === true &&
//       !this.props.read_only;

//     return (
//       <div
//         ref={this.tableRef}
//         className={`SortableItem rfb-item${this.props.data.pageBreakBefore ? " alwaysbreak" : ""
//           }`}
//       >
//         <ComponentHeader {...this.props} />
//         <div
//           className="form-group"
//           onClick={() => {
//             if (isSameEditor) {
//               this.clickToSign();
//             }
//           }}
//           style={{ cursor: "pointer" }}
//         >
//           {hasRequiredLabel && (
//             <span
//               className="label-required badge badge-danger"
//               style={{
//                 marginLeft: "60%",
//               }}
//             >
//               Required
//             </span>
//           )}
//           <h5 style={{ textAlign: "center" }}>
//             {this.state.isSigned ? "Already signed" : "(Click to sign)"}
//           </h5>
//           <div
//             style={{
//               textAlign: "center",
//               marginTop: 8,
//               marginBottom: 8,
//               color: this.state.isError ? "red" : "black",
//             }}
//           >
//             {this.state.isError
//               ? "You have no permission to sign"
//               : "__________________"}
//           </div>
//           <h6 style={{ textAlign: "center", minHeight: 20 }}>
//             {this.state.isSigned && `(${this.state.signedPerson})`}
//           </h6>
//           <h6 style={{ textAlign: "center" }}>
//             {this.props.data.position || "Placeholder Text"}
//           </h6>
//         </div>
//       </div>
//     );
//   }
// }

// export default Signature2;

import React, { useState, useRef } from "react";
import ComponentHeader from "./component-header";

function Signature2(props) {
  const inputField = useRef(null);

  const [defaultValue, setDefaultValue] = useState(
    props.defaultValue && props.defaultValue.isSigned
  );
  const [isSigned, setIsSigned] = useState(
    props.defaultValue && props.defaultValue.isSigned
  );
  const [signedPerson, setSignedPerson] = useState(
    props.defaultValue && props.defaultValue.signedPerson
  );
  const [signedPersonId, setSignedPersonId] = useState(
    props.defaultValue && props.defaultValue.signedPersonId
  );
  const [isError, setIsError] = useState(false);

  if (props.defaultValue && props.defaultValue.isSigned !== defaultValue) {
    setDefaultValue(props.defaultValue && props.defaultValue.isSigned);
    setIsSigned(props.defaultValue && props.defaultValue.isSigned);
    setIsError(false);
    setSignedPerson(props.defaultValue.signedPerson);
    setSignedPersonId(props.defaultValue && props.defaultValue.signedPersonId);
  }

  const clickToSign = () => {
    if (typeof props.getActiveUserProperties !== "function") {
      return;
    }

    const userProperties = props.getActiveUserProperties();
    let roleLists = (userProperties && userProperties.role) || [];
    roleLists = roleLists.concat([
      (userProperties && userProperties.name) || "",
    ]);

    const position = `${props.data.position}`.toLocaleLowerCase().trim();
    const prevIsSigned = isSigned;

    if (
      props.data.specificRole === "specific" &&
      roleLists.find(
        (item) => `${item}`.toLocaleLowerCase().trim() === position
      )
    ) {
      setIsSigned(!prevIsSigned);
      setSignedPerson(!prevIsSigned ? userProperties.name : "");
      setSignedPersonId(!prevIsSigned ? userProperties.userId : "");
    } else if (props.data.specificRole === "notSpecific") {
      setIsSigned(!prevIsSigned);
      setSignedPerson(!prevIsSigned ? userProperties.name : "");
      setSignedPersonId(!prevIsSigned ? userProperties.userId : "");
    } else {
      if (!isError) {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 5000);
      }
      console.log("role annd name does not match");
    }
  };

  const userProperties =
    props.getActiveUserProperties && props.getActiveUserProperties();

  const savedEditor = props.editor;
  let isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }

  const hasRequiredLabel =
    props.data.hasOwnProperty("required") &&
    props.data.required === true &&
    !props.read_only;

  return (
    <div
      ref={inputField}
      className={`SortableItem rfb-item${
        props.data.pageBreakBefore ? " alwaysbreak" : ""
      }`}
    >
      <ComponentHeader {...props} />
      <div
        className="form-group"
        onClick={() => {
          if (isSameEditor) {
            clickToSign();
          }
        }}
        style={{ cursor: "pointer" }}
      >
        {hasRequiredLabel && (
          <span
            className="label-required badge badge-danger"
            style={{
              marginLeft: "60%",
            }}
          >
            Required
          </span>
        )}
        <h5 style={{ textAlign: "center" }}>
          {isSigned ? "Already signed" : "(Click to sign)"}
        </h5>
        <div
          style={{
            textAlign: "center",
            marginTop: 8,
            marginBottom: 8,
            color: isError ? "red" : "black",
          }}
        >
          {isError ? "You have no permission to sign" : "__________________"}
        </div>
        <h6 style={{ textAlign: "center", minHeight: 20 }}>
          {isSigned && `(${signedPerson})`}
        </h6>
        <h6 style={{ textAlign: "center" }}>
          {props.data.position || "Placeholder Text"}
        </h6>
      </div>
    </div>
  );
}

export default Signature2;
