import React from "react";
import "./index.scss";

function TitleHeader({ name, type }) {
  let background = "#0d6efdde";
  if (type == "pdf") {
    background = "#9c002cf2";
  } else if (type == "sheet") {
    background = "#217446";
  }
  return (
    <div className="title-header" style={{ backgroundColor: background }}>
      <label>{name}</label>
    </div>
  );
}

export default TitleHeader;
