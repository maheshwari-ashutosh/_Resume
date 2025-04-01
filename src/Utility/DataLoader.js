import {
  headerInfo as header,
  contactInfo as contact,
  workExperience,
  education,
  achievements,
  skills,
  projects
} from '../data/personalInfo';

export function loadData(customData = null) {
  if (customData) {
    console.log('Loading custom data:', customData);
    
    // Deep copy to avoid reference issues
    const processedData = {
      header: {
        header: customData.headerInfo ? {
          name: customData.headerInfo.name || header.name,
          currentPosition: customData.headerInfo.currentPosition || header.currentPosition,
          summary: customData.headerInfo.summary || header.summary
        } : header,
        contact: customData.contactInfo ? {
          email: customData.contactInfo.email || contact.email,
          phone: customData.contactInfo.phone || contact.phone,
          linkedin: customData.contactInfo.linkedin || contact.linkedin
        } : contact
      },
      contact: customData.contactInfo || contact,
      workExperience: customData.workExperience || workExperience,
      education: customData.education || education,
      achievements: customData.achievements || achievements,
      skills: customData.skills || skills,
      projects: customData.projects || projects
    };
    
    return processedData;
  }

  return {
    header: {header, contact},
    contact,
    workExperience,
    education,
    achievements,
    skills,
    projects
  };
}
