import React from "react";

const WorkExperienceCard = (props) => {
  const { companyDetails, companyName } = props;

  return (
    <div className="workExperienceCard">
      <div className="experienceDetails">
        <div className="d-flex justify-space-between">
          <div className="d-flex column">
            <div className="companyName">{companyName}</div>
            <div className="jobTitle">{companyDetails.jobTitle}</div>
          </div>
          <div>
            <div className="place">{companyDetails.place} </div>
            <div className="duration">
              {companyDetails.fromDate} - {companyDetails.toDate}
            </div>
          </div>
        </div>
        <ul className="workItems top-level">
          {renderNestedWorkItems(companyDetails.workItems)}
        </ul>
      </div>
    </div>
  );
};

const renderNestedWorkItems = (list) =>
  list.map((item, index) => {
    if (Array.isArray(item)) {
      return (
        <li className="workItems-group">
          <p className="workItems-Heading">{item[0]}</p>
          <ul className="workItems">{renderNestedWorkItems(item.slice(1))}</ul>
        </li>
      );
    }
    return <li key={index}>{item}</li>;
  });

export default WorkExperienceCard;
