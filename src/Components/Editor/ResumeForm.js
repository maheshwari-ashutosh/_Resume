import React, { useState, useEffect, useCallback } from 'react';
import './ResumeForm.css';

// Generate month and year options for date pickers
const generateMonthOptions = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months.map((month, index) => (
    <option key={index} value={month}>{month}</option>
  ));
};

const generateYearOptions = (includePresent = false) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  if (includePresent) {
    years.push('Present');
  }
  for (let year = currentYear; year >= currentYear - 30; year--) {
    years.push(year.toString());
  }
  
  return years.map((year) => (
    <option key={year} value={year}>{year}</option>
  ));
};

// Date picker component
const DatePicker = ({ value, onChange, isEndDate = false }) => {
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === 'Start Date' || dateStr === 'End Date') {
      return { month: 'January', year: new Date().getFullYear().toString() };
    }
    if (isEndDate && dateStr === 'Present') {
      return { month: 'Present', year: 'Present' };
    }
    const dateRegex = /([a-zA-Z]+)\s*(\d{4})?/;
    const match = dateStr.match(dateRegex);
    if (match) {
      return { month: match[1], year: match[2] || new Date().getFullYear().toString() };
    }
    return { month: 'January', year: new Date().getFullYear().toString() };
  };
  
  const { month, year } = parseDate(value);
  
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    if (isEndDate && newMonth === 'Present') {
      onChange('Present');
    } else if (year === 'Present') {
      onChange(`${newMonth} ${new Date().getFullYear()}`)
    } else {
      onChange(`${newMonth} ${year}`);
    }
  };
  
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    if (isEndDate && newYear === 'Present') {
      onChange('Present');
    } else {
      onChange(`${month === 'Present' ? 'January' : month} ${newYear}`);
    }
  };
  
  return (
    <div className="date-picker">
      <select value={month} onChange={handleMonthChange} disabled={year === 'Present' && isEndDate}>
        {isEndDate && <option value="Present">Present</option>}
        {generateMonthOptions()}
      </select>
      <select value={year} onChange={handleYearChange}>
        {generateYearOptions(isEndDate)}
      </select>
    </div>
  );
};

const ResumeForm = ({ initialData, onDataChange, onClose }) => {
  const [formData, setFormData] = useState(initialData);
  const [activeSection, setActiveSection] = useState('personal');
  
  const [companyKeysOrder, setCompanyKeysOrder] = useState(() => Object.keys(initialData?.workExperience || {}));
  const [degreeKeysOrder, setDegreeKeysOrder] = useState(() => Object.keys(initialData?.education || {}));

  useEffect(() => {
    console.log("ResumeForm received new initialData:", initialData);
    if (initialData) {
      if (JSON.stringify(initialData) !== JSON.stringify(formData)) {
        console.log("Updating form state from initialData");
        const newFormData = JSON.parse(JSON.stringify(initialData));
        setFormData(newFormData);
        setCompanyKeysOrder(Object.keys(newFormData.workExperience || {}));
        setDegreeKeysOrder(Object.keys(newFormData.education || {}));
      }
    }
  }, [initialData]);

  const updateParent = useCallback((updatedSectionData) => {
    console.log("ResumeForm calling onDataChange with:", updatedSectionData);
    onDataChange(updatedSectionData);
  }, [onDataChange]);

  const handleInputChange = (section, field, value) => {
    const updatedSection = { ...(formData[section] || {}), [field]: value };
    setFormData(prev => ({ ...prev, [section]: updatedSection }));
    updateParent({ [section]: updatedSection });
  };

  const handleContactChange = (fieldType, subField, value) => {
    setFormData(prev => {
      const contactInfo = prev.contactInfo || {};
      const fieldData = contactInfo[fieldType] || {};
      
      const updatedFieldData = { 
        ...fieldData,
        [subField]: value 
      };
      
      const updatedContactInfo = { 
        ...contactInfo, 
        [fieldType]: updatedFieldData 
      };
      
      const newState = { ...prev, contactInfo: updatedContactInfo };
      
      updateParent({ contactInfo: updatedContactInfo });
      
      return newState;
    });
  };

  const handleWorkItemChange = (companyKey, index, value) => {
    const workExperience = formData.workExperience || {};
    const companyData = workExperience[companyKey];
    if (!companyData || !Array.isArray(companyData.workItems)) return;
    
    const updatedWorkItems = [...companyData.workItems];
    updatedWorkItems[index] = value;
    
    const updatedCompanyData = { ...companyData, workItems: updatedWorkItems };
    const updatedWorkExperience = {
      ...workExperience,
      [companyKey]: updatedCompanyData
    };
    setFormData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
    updateParent({ workExperience: updatedWorkExperience });
  };

  const handleWorkCompanyChange = (companyKey, field, value) => {
    const workExperience = formData.workExperience || {};
    const updatedCompanyData = {
      ...(workExperience[companyKey] || {}),
      [field]: value
    };
    const updatedWorkExperience = {
      ...workExperience,
      [companyKey]: updatedCompanyData
    };
    setFormData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
    updateParent({ workExperience: updatedWorkExperience });
  };

  const handleEducationChange = (degreeKey, field, value) => {
    const education = formData.education || {};
    const updatedDegreeData = {
      ...(education[degreeKey] || {}),
      [field]: value
    };
    const updatedEducation = {
      ...education,
      [degreeKey]: updatedDegreeData
    };
    setFormData(prev => ({ ...prev, education: updatedEducation }));
    updateParent({ education: updatedEducation });
  };

  const handleSkillChange = (index, value) => {
    const skills = formData.skills || [];
    const updatedSkills = [...skills];
    if (index >= 0 && index < updatedSkills.length) {
      updatedSkills[index] = value;
      setFormData(prev => ({ ...prev, skills: updatedSkills }));
      updateParent({ skills: updatedSkills });
    }
  };

  const handleProjectChange = (index, field, value) => {
    const projects = formData.projects || [];
    const updatedProjects = [...projects];
    if (index >= 0 && index < updatedProjects.length) {
      updatedProjects[index] = {
        ...(updatedProjects[index] || {}),
        [field]: value
      };
      setFormData(prev => ({ ...prev, projects: updatedProjects }));
      updateParent({ projects: updatedProjects });
    }
  };

  const addSkill = () => {
    const updatedSkills = [...(formData.skills || []), "New Skill"];
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
    updateParent({ skills: updatedSkills });
  };

  const addProject = () => {
    const updatedProjects = [...(formData.projects || []), { title: "New Project", detail: "Project description" }];
    setFormData(prev => ({ ...prev, projects: updatedProjects }));
    updateParent({ projects: updatedProjects });
  };

  const addWorkExperience = () => {
    const newCompanyKey = `new_company_${Date.now()}`;
    const newWorkExperienceEntry = {
      companyName: newCompanyKey,
      fromDate: "January 2023",
      toDate: "Present",
      place: "Location",
      jobTitle: "Job Title",
      workItems: ["Work description"]
    };
    const updatedWorkExperience = {
      ...(formData.workExperience || {}),
      [newCompanyKey]: newWorkExperienceEntry
    };
    setFormData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
    setCompanyKeysOrder(prevOrder => [...prevOrder, newCompanyKey]);
    updateParent({ workExperience: updatedWorkExperience });
  };

  const addEducation = () => {
    const newDegreeKey = `new_degree_${Date.now()}`;
    const newEducationEntry = {
      degreeName: newDegreeKey,
      name: "Institution Name",
      from: "January 2020",
      to: "December 2023",
      summary: ""
    };
    const updatedEducation = {
      ...(formData.education || {}),
      [newDegreeKey]: newEducationEntry
    };
    setFormData(prev => ({ ...prev, education: updatedEducation }));
    setDegreeKeysOrder(prevOrder => [...prevOrder, newDegreeKey]);
    updateParent({ education: updatedEducation });
  };

  const removeSkill = (index) => {
    const skills = formData.skills || [];
    const updatedSkills = [...skills];
    if (index >= 0 && index < updatedSkills.length) {
      updatedSkills.splice(index, 1);
      setFormData(prev => ({ ...prev, skills: updatedSkills }));
      updateParent({ skills: updatedSkills });
    }
  };

  const removeProject = (index) => {
    const projects = formData.projects || [];
    const updatedProjects = [...projects];
    if (index >= 0 && index < updatedProjects.length) {
      updatedProjects.splice(index, 1);
      setFormData(prev => ({ ...prev, projects: updatedProjects }));
      updateParent({ projects: updatedProjects });
    }
  };

  const removeWorkExperience = (companyKeyToRemove) => {
    const { [companyKeyToRemove]: removed, ...updatedWorkExperience } = formData.workExperience || {};
    setFormData(prev => ({ 
        ...prev, 
        workExperience: updatedWorkExperience 
    }));
    setCompanyKeysOrder(prevOrder => prevOrder.filter(key => key !== companyKeyToRemove));
    updateParent({ workExperience: updatedWorkExperience });
  };

  const removeEducation = (degreeKeyToRemove) => {
    const { [degreeKeyToRemove]: removed, ...updatedEducation } = formData.education || {};
    setFormData(prev => ({ 
        ...prev, 
        education: updatedEducation 
    }));
    setDegreeKeysOrder(prevOrder => prevOrder.filter(key => key !== degreeKeyToRemove));
    updateParent({ education: updatedEducation });
  };

  const handleCompanyKeyChange = (oldKey, newKey) => {
    newKey = newKey.trim();
    if (!newKey || oldKey === newKey) return;
    
    const workExperience = formData.workExperience || {};
    if (workExperience[newKey]) {
      console.warn("Attempted to rename company to an existing key:", newKey);
      return; 
    }

    const { [oldKey]: companyData, ...restWorkExperience } = workExperience;
    const updatedWorkExperience = { 
      ...restWorkExperience, 
      [newKey]: { ...companyData, companyName: newKey } 
    };

    setFormData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
    setCompanyKeysOrder(prevOrder => prevOrder.map(key => key === oldKey ? newKey : key));
    updateParent({ workExperience: updatedWorkExperience });
  };

  const handleDegreeKeyChange = (oldKey, newKey) => {
     newKey = newKey.trim();
    if (!newKey || oldKey === newKey) return;

    const education = formData.education || {};
     if (education[newKey]) {
      console.warn("Attempted to rename degree to an existing key:", newKey);
      return;
    }

    const { [oldKey]: degreeData, ...restEducation } = education;
    const updatedEducation = { 
        ...restEducation, 
        [newKey]: { ...degreeData, degreeName: newKey } 
    };

    setFormData(prev => ({ ...prev, education: updatedEducation }));
    setDegreeKeysOrder(prevOrder => prevOrder.map(key => key === oldKey ? newKey : key));
    updateParent({ education: updatedEducation });
  };

  if (!formData || !formData.headerInfo) {
    console.log("ResumeForm: formData not ready, returning null");
    return null;
  }
  console.log("ResumeForm rendering with formData:", formData);

  return (
    <div className="resume-form">
      <div className="form-header">
        <h2>Edit Resume</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="form-tabs">
        {['personal', 'experience', 'education', 'skills', 'projects'].map(section => (
          <button 
            key={section}
            className={activeSection === section ? 'active' : ''} 
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)} 
          </button>
        ))}
      </div>
      
      <div className="form-content">
        {activeSection === 'personal' && (
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={formData.headerInfo.name || ''} 
                onChange={(e) => handleInputChange('headerInfo', 'name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input 
                type="text" 
                value={formData.headerInfo.currentPosition || ''} 
                onChange={(e) => handleInputChange('headerInfo', 'currentPosition', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Professional Summary</label>
              <textarea 
                value={formData.headerInfo.summary || ''} 
                onChange={(e) => handleInputChange('headerInfo', 'summary', e.target.value)}
                rows={4}
              />
            </div>
            
            <h3>Contact Information</h3>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={formData.contactInfo?.email?.displayValue || ''} 
                onChange={(e) => {
                  const value = e.target.value;
                  handleContactChange('email', 'displayValue', value);
                  handleContactChange('email', 'value', `mailto:${value}`);
                }}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                value={formData.contactInfo?.phone?.displayValue || ''} 
                onChange={(e) => {
                  const value = e.target.value;
                  handleContactChange('phone', 'displayValue', value);
                  handleContactChange('phone', 'value', `tel:${value}`);
                }}
              />
            </div>
            <div className="form-group">
              <label>LinkedIn Profile Name</label>
              <input 
                type="text" 
                value={formData.contactInfo?.linkedin?.value?.split('/').pop() || formData.contactInfo?.linkedin?.displayValue || ''} 
                onChange={(e) => {
                  const username = e.target.value.trim();
                  const fullUrl = username ? `https://www.linkedin.com/in/${username}` : '';
                  const display = username ? username : '';
                  handleContactChange('linkedin', 'displayValue', display);
                  handleContactChange('linkedin', 'value', fullUrl);
                }}
                placeholder="your-profile-name"
              />
            </div>
          </div>
        )}
        
        {activeSection === 'experience' && (
          <div className="form-section">
            <h3>Work Experience <button className="add-button" onClick={addWorkExperience}>+ Add</button></h3>
            
            {companyKeysOrder.map((companyKey, displayIndex) => {
              const workDetails = formData.workExperience?.[companyKey];
              if (!workDetails) return null; 
              return (
                <div key={companyKey} className="form-subsection">
                  <div className="form-group-header">
                    <h4>{workDetails.companyName || companyKey}</h4>
                    <button className="remove-button" onClick={() => removeWorkExperience(companyKey)}>Remove</button>
                  </div>
                  
                  <div className="form-group">
                    <label>Company Name (Identifier)</label>
                    <input 
                      type="text" 
                      defaultValue={workDetails.companyName || companyKey} 
                      onBlur={(e) => handleCompanyKeyChange(companyKey, e.target.value)}
                      key={`${companyKey}-nameInput`}
                      placeholder="Enter unique company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input 
                      type="text" 
                      value={workDetails.jobTitle || ''} 
                      onChange={(e) => handleWorkCompanyChange(companyKey, 'jobTitle', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <DatePicker 
                        value={workDetails.fromDate || ''} 
                        onChange={(value) => handleWorkCompanyChange(companyKey, 'fromDate', value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <DatePicker 
                        value={workDetails.toDate || ''} 
                        onChange={(value) => handleWorkCompanyChange(companyKey, 'toDate', value)}
                        isEndDate={true}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      value={workDetails.place || ''} 
                      onChange={(e) => handleWorkCompanyChange(companyKey, 'place', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Work Items</label>
                    {(workDetails.workItems || []).map((item, idx) => (
                      <div key={idx} className="form-list-item">
                        <textarea 
                          value={item} 
                          onChange={(e) => handleWorkItemChange(companyKey, idx, e.target.value)}
                          rows={2}
                        />
                        <button 
                          className="small-button"
                          onClick={() => {
                            const workItems = workDetails.workItems || [];
                            const updatedWorkItems = [...workItems];
                            if (idx >= 0 && idx < updatedWorkItems.length) {
                               updatedWorkItems.splice(idx, 1);
                               handleWorkCompanyChange(companyKey, 'workItems', updatedWorkItems);
                            }
                          }}
                        >
                          Remove Item
                        </button>
                      </div>
                    ))}
                    <button 
                      className="add-button"
                      onClick={() => {
                        const workItems = workDetails.workItems || [];
                        const updatedWorkItems = [...workItems, "New work item"];
                        handleWorkCompanyChange(companyKey, 'workItems', updatedWorkItems);
                      }}
                    >
                      + Add Work Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeSection === 'education' && (
          <div className="form-section">
            <h3>Education <button className="add-button" onClick={addEducation}>+ Add</button></h3>
            
            {degreeKeysOrder.map((degreeKey, displayIndex) => {
              const eduDetails = formData.education?.[degreeKey];
              if (!eduDetails) return null;
              return (
                <div key={degreeKey} className="form-subsection">
                  <div className="form-group-header">
                    <h4>{eduDetails.degreeName || degreeKey}</h4>
                    <button className="remove-button" onClick={() => removeEducation(degreeKey)}>Remove</button>
                  </div>
                  
                  <div className="form-group">
                    <label>Degree Name (Identifier)</label>
                    <input 
                      type="text" 
                      defaultValue={eduDetails.degreeName || degreeKey} 
                      onBlur={(e) => handleDegreeKeyChange(degreeKey, e.target.value)}
                      key={`${degreeKey}-nameInput`}
                      placeholder="Enter unique degree name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Institution</label>
                    <input 
                      type="text" 
                      value={eduDetails.name || ''} 
                      onChange={(e) => handleEducationChange(degreeKey, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <DatePicker 
                        value={eduDetails.from || ''} 
                        onChange={(value) => handleEducationChange(degreeKey, 'from', value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <DatePicker 
                        value={eduDetails.to || ''} 
                        onChange={(value) => handleEducationChange(degreeKey, 'to', value)}
                        isEndDate={true}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Summary / Details (Optional)</label>
                    <textarea 
                      value={eduDetails.summary || ''} 
                      onChange={(e) => handleEducationChange(degreeKey, 'summary', e.target.value)}
                      rows={3}
                      placeholder="E.g., GPA, relevant coursework, honors"
                    />
                  </div>
                </div>
              );
             })}
          </div>
        )}
        
        {activeSection === 'skills' && (
          <div className="form-section">
            <h3>Skills <button className="add-button" onClick={addSkill}>+ Add</button></h3>
            
            {(formData.skills || []).map((skill, index) => (
              <div key={index} className="form-list-item">
                <input 
                  type="text" 
                  value={skill} 
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                />
                <button className="small-button" onClick={() => removeSkill(index)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        
        {activeSection === 'projects' && (
          <div className="form-section">
            <h3>Projects <button className="add-button" onClick={addProject}>+ Add</button></h3>
            
            {(formData.projects || []).map((project, index) => (
              <div key={index} className="form-subsection">
                <div className="form-group-header">
                  <h4>{project.title || `Project ${index + 1}`}</h4>
                  <button className="remove-button" onClick={() => removeProject(index)}>Remove</button>
                </div>
                
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={project.title || ''} 
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={project.detail || ''} 
                    onChange={(e) => handleProjectChange(index, 'detail', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm; 