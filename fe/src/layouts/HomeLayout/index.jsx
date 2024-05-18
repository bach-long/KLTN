import React from "react";
import Navbar from "../../components/Navbar";
import PropTypes from "prop-types";
import "./index.scss";

function HomeLayout(props) {
  return (
    <div id="home-layout">
      <Navbar items={props.items} />
      <div id="app-content">{props.children}</div>
    </div>
  );
}

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
  items: PropTypes.array.isRequired,
  // other prop types...
};

export default HomeLayout;
