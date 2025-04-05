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

        let workItems = workDetails.workItems;
        

        return (
          // Use original class names expected by CSS
          <div key={companyKey} className='workExperienceCard'>
            <div className='workExperienceCardHeading d-flex justify-space-between'>
              <div className='companyName'>{workDetails.companyName || companyKey}</div>
              {/* Use formatted date range */}
              <div className='d-flex'>
                {displayDateRange && <div className='dateOfJoining duration'>{displayDateRange}</div>}
                {workDetails.place && <div className='dateOfJoining duration'>{", " + workDetails.place}</div>}
              </div>
            </div>
            <div className='jobTitle'>{workDetails.jobTitle}</div>
            
            {workDetails.workItems && Array.isArray(workDetails.workItems) && workDetails.workItems.length > 0 && (
              <ul className='workDescription'>
                {
                  workItems.map((item, index) => {
                    if(item.includes(",")) {
                      const items = item.split(",");
                      return <li className='workDescriptionItemHeading'>{items[0]  }<ul>
                        {items.slice(1).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul></li>
                    }
                    return <li key={index}>{item}</li>;
      })
                }
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkExperience;
