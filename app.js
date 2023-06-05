import React from "react";
import ReactDOM from "react-dom";
import DemoBar from "./demobar";
// eslint-disable-next-line no-unused-vars
import FormBuilder, { Registry } from "./src/index";
import * as variables from "./variables";

// Add our stylesheets for the demo.
require("./scss/application.scss");

const url = "/api/formdata";
const saveUrl = "/api/formdata";

ReactDOM.render(
  <FormBuilder.ReactFormBuilder
    variables={variables}
    url={url}
    saveUrl={saveUrl}
    onImageUpload={() => {
      // return Math.random(1000).toString()
      return "http://www.isocafe.com:8080/VisiforgeDC//temp/formimage/C27E1F69-7C67-4306-8A08-5A783F27F9F3.jpeg";
    }}
    // toolbarItems={items}
    onChange={(data) => {
      console.log(">>>>>>", data);
    }}
  />,
  document.getElementById("form-builder")
);

ReactDOM.render(
  <DemoBar variables={variables} />,
  document.getElementById("demo-bar")
);
