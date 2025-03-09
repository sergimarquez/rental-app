import React from "react";

const imgBackground = require("../../assets/images/house-background.jpg");
const divStyle = {
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${imgBackground})`,
};

const Background = (props) => {
  return <div style={divStyle}>{props.children}</div>;
};

export default Background;
