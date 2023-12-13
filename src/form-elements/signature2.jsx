import React, { useState } from "react";
import ComponentHeader from "./component-header";
import { useFormContext, FORM_ACTION } from "../context/form-context";

function Signature2(props) {
  const { dispatch } = useFormContext();

  const [isError, setIsError] = useState(false);
  const [isSigned, setIsSigned] = useState(props.defaultValue?.isSigned);
  const [signedPerson, setSignedPerson] = useState(
    props.defaultValue?.signedPerson
  );

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
      const newVal = {
        isSigned: !prevIsSigned,
        signedPerson: !prevIsSigned ? userProperties.name : "",
        signedPersonId: !prevIsSigned ? userProperties.userId : "",
      };
      setIsSigned(newVal.isSigned);
      setSignedPerson(newVal.signedPerson);
      dispatch({
        type: FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: newVal,
      });
    } else if (props.data.specificRole === "notSpecific") {
      const newVal = {
        isSigned: !prevIsSigned,
        signedPerson: !prevIsSigned ? userProperties.name : "",
        signedPersonId: !prevIsSigned ? userProperties.userId : "",
      };
      setIsSigned(newVal.isSigned);
      setSignedPerson(newVal.signedPerson);
      dispatch({
        type: FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: newVal,
      });
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
