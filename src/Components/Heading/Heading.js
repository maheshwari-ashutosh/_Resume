import React from "react";
import './Heading.css';

const Heading = (props) => {
  return <div id='Heading'>
    {props.heading}
  </div>
}

export default Heading;