import React from 'react';

const EducationCard = (props) => {
  const {degree, degreeDetail} = props;
  return <div className='educationCard'>
    <div className="d-flex justify-content-between">
      <div>
    <div className='degreeName'>{degreeDetail.name && `${degreeDetail.name}`}</div>
    <div className='degree'>{degree}</div>
    </div>
    <div className='duration'>{degreeDetail.from} - {degreeDetail.to}</div>
    </div>
    <ul className='summary'>
      {degreeDetail.summary}
    </ul>
  </div>;
};

export default EducationCard;
