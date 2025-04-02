import React from 'react';
import './WorkExperience.css';
import Heading from '../Heading/Heading';

const getDisplayDate = (dateString) => {
  if (!dateString) return '';
  if (dateString.toLowerCase() === 'present') {
    return 'Present';
  }
  return dateString;
}

const WorkExperience = ({ data }) => {
  // data is expected to be a sorted array of [key, value] pairs
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div id="WorkExperience">
      <Heading heading="Work Experience" />
      {data.map(([companyKey, workDetails]) => {
        if (!workDetails) return null; // Skip if details are missing
        
        // Format dates for display
        
        const fromMonth = getDisplayDate(workDetails.fromDate);
        const toMonth = getDisplayDate(workDetails.toDate);
        const displayDateRange = fromMonth ? `${fromMonth} - ${toMonth} ` : `${toMonth}`; // Handle cases with only end date?

        return (
          // Use original class names expected by CSS
          <div key={companyKey} className='workExperienceCard'>
            <div className='workExperienceCardHeading d-flex justify-space-between'>
              <div className='companyName'>{workDetails.companyName || companyKey}</div>
              {/* Use formatted date range */}
              {displayDateRange && <div className='dateOfJoining duration'>{displayDateRange}</div>}
            </div>
            <div className='jobTitle'>{workDetails.jobTitle}</div>
            {workDetails.place && <div className='jobLocation'>{workDetails.place}</div>}
            
            {workDetails.workItems && Array.isArray(workDetails.workItems) && workDetails.workItems.length > 0 && (
              <ul className='workDescription'>
                {workDetails.workItems.map((item, index) => (
                  // Simple list items for now, can be enhanced later
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkExperience;
