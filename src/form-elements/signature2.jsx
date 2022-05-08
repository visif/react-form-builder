import React from "react";
import ComponentHeader from "./component-header";

class Signature2 extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    this.state = {
      defaultValue: props.defaultValue && props.defaultValue.isSigned,
      isSigned: props.defaultValue && props.defaultValue.isSigned,
      signedPerson: props.defaultValue && props.defaultValue.signedPerson,
      isError: false,
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log("Signature getDerivedStateFromProps");
    if (
      props.defaultValue &&
      props.defaultValue.isSigned !== state.defaultValue
    ) {
      return {
        defaultValue: props.defaultValue && props.defaultValue.isSigned,
        isSigned: props.defaultValue && props.defaultValue.isSigned,
        isError: false,
        signedPerson: props.defaultValue.signedPerson,
      };
    }

    return state;
  };

  clickToSign = () => {
    if (typeof this.props.getActiveUserProperties !== "function") {
      return;
    }

    const userProperties = this.props.getActiveUserProperties();
    let roleLists = (userProperties && userProperties.role) || [];
    roleLists = roleLists.concat([
      (userProperties && userProperties.name) || "",
    ]);

    const position = `${this.props.data.position}`.toLocaleLowerCase().trim();

    if (
      this.props.data.specificRole === "specific" &&
      roleLists.find(
        (item) => `${item}`.toLocaleLowerCase().trim() === position
      )
    ) {
      this.setState((current) => ({
        ...current,
        isSigned: !current.isSigned,
        signedPerson: !current.isSigned ? userProperties.name : "",
      }));
    } else if (this.props.data.specificRole === "notSpecific") {
      this.setState((current) => ({
        ...current,
        isSigned: !current.isSigned,
        signedPerson: !current.isSigned ? userProperties.name : "",
      }));
    } else {
      if (!this.state.isError) {
        this.setState({
          isError: true,
        });
        setTimeout(() => {
          this.setState({
            isError: false,
          });
        }, 5000);
      }
      console.log("role annd name does not match");
    }
  };

  render() {
    const hasRequiredLabel =
      this.props.data.hasOwnProperty("required") &&
      this.props.data.required === true &&
      !this.props.read_only;

    return (
      <div
        ref={this.tableRef}
        className={`SortableItem rfb-item${
          this.props.data.pageBreakBefore ? " alwaysbreak" : ""
        }`}
      >
        <ComponentHeader {...this.props} />
        <div
          className="form-group"
          onClick={this.clickToSign}
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
            {this.state.isSigned ? "Already signed" : "(Click to sign)"}
          </h5>
          <div
            style={{
              textAlign: "center",
              marginTop: 8,
              marginBottom: 8,
              color: this.state.isError ? "red" : "inherit",
            }}
          >
            {this.state.isError
              ? "You have no permission to sign"
              : "__________________"}
          </div>
          <h6 style={{ textAlign: "center", minHeight: 20 }}>
            {this.state.isSigned && `(${this.state.signedPerson})`}
          </h6>
          <h6 style={{ textAlign: "center" }}>
            {this.props.data.position || "Placeholder Text"}
          </h6>
        </div>
      </div>
    );
  }
}

export default Signature2;
