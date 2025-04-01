import React from "react";
import "./Achievement.css";
import Heading from "../Heading/Heading";

const Achievement = (props) => {
  const achievements = props.data;
  if (achievements.length === 0) {
    return <></>;
  }
  return (
    <div id="Achievement">
      <Heading heading="Achievements" />
      {achievements.map((achievement) => {
        return (
          <div className="achievement">
            <div className="title">{achievement.title}</div>
            <div className="detail">{achievement.detail}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Achievement;
