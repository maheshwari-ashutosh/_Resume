import React from 'react';
import './WorkExperience.css';
import Heading from '../Heading/Heading';

// Helper to extract year or return "Present"
const getDisplayYear = (dateString) => {
  if (!dateString) return '';
  if (dateString.toLowerCase() === 'present') {
    return 'Present';
  }
  const parts = dateString.trim().split(/\s+/);
  if (parts.length === 2) {
    const year = parseInt(parts[1], 10);
    if (!isNaN(year)) {
      return year.toString();
    }
  }
  // Fallback: return original string if parsing failed
  return dateString; 
};

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
        const fromYear = getDisplayYear(workDetails.fromDate);
        const toYear = getDisplayYear(workDetails.toDate);
        const displayDateRange = fromYear ? `${fromYear} - ${toYear}` : toYear; // Handle cases with only end date?

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
