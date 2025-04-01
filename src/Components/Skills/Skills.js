import React from "react";
import "./Skills.css";
import Heading from "../Heading/Heading";

const Skills = (props) => {
  const skills = props.data;
  if (skills.length === 0) return <></>;
  return (
    <div id="Skills">
      <Heading heading="Skills and Certification" />
      <div className="skills d-flex flex-wrap">
        {skills.map((item, index) => {
          if (index === skills.length - 1) {
            return <div className="skill">{item}</div>;
          }
          return <div className="skill">{item}</div>;
        })}
      </div>
    </div>
  );
};

export default Skills;
