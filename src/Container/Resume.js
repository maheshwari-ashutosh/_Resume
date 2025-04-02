import React, { useEffect, useState, useCallback } from "react";
import "./Resume.css";

import Header from "../Components/Header/Header";
import WorkExperience from "../Components/WorkExperience/WorkExperience";
import Education from "../Components/Education/Education";
import Achievement from "../Components/Achievements/Achievement";
import Skills from "../Components/Skills/Skills";
import { loadData } from "../Utility/DataLoader";
import Projects from "../Components/Projects/Projects";
import DownloadTemplate from "../Components/DownloadTemplate/DownloadTemplate";
import FileUpload from "../Components/FileUpload/FileUpload";
import ResumeForm from "../Components/Editor/ResumeForm";

// Helper function to parse dates like "Month Year" or handle "Present"
const parseSortableDate = (dateString) => {
  if (!dateString) return 0; // Treat missing dates as oldest
  if (dateString.toLowerCase() === 'present') {
    return Infinity; // Treat "Present" as the newest date
  }
  const months = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };
  const parts = dateString.trim().split(/\s+/);
  if (parts.length === 2) {
    const month = months[parts[0].toLowerCase()];
    const year = parseInt(parts[1], 10);
    if (!isNaN(month) && !isNaN(year)) {
      // Return YYYYMM for sorting (e.g., 202311 for Dec 2023)
      return year * 100 + month; 
    }
  }
  return 0; // Fallback for unparseable dates
};

const Resume = (props) => {
  const [resumeData, setResumeData] = useState(null); // Single source of truth
  const [loading, setLoading] = useState(true);
  const [fontSizeScale, setFontSizeScale] = useState(1); // Default scale factor
  const [showEditor, setShowEditor] = useState(false);

  // Load initial data
  useEffect(() => {
    try {
      const initialLoadData = loadData(JSON.parse(localStorage.getItem('resumeData'))); // Load default data initially
      console.log('Initial loaded data:', initialLoadData);
      
      // Ensure all expected top-level keys exist, even if empty
      setResumeData({
        headerInfo: initialLoadData.header?.header || { name: '', currentPosition: '', summary: '' },
        contactInfo: initialLoadData.header?.contact || {
          email: { value: '', displayValue: '', icon: 'fa fa-envelope' },
          phone: { value: '', displayValue: '', icon: 'fa fa-phone' },
          linkedin: { value: '', displayValue: '', icon: 'fa fa-linkedin' }
        },
        workExperience: initialLoadData.workExperience || {},
        education: initialLoadData.education || {},
        achievements: initialLoadData.achievements || [],
        skills: initialLoadData.skills || [],
        projects: initialLoadData.projects || []
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Fallback to a minimal structure
      setResumeData({
         headerInfo: { name: 'Error Loading Name', currentPosition: '', summary: '' },
         contactInfo: { email: {}, phone: {}, linkedin: {} },
         workExperience: {}, education: {}, achievements: [], skills: [], projects: []
      });
    } finally {
      setLoading(false);
    }
  }, []); // Run only once on mount

  // Set CSS variable when font scale changes
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontSizeScale);
  }, [fontSizeScale]);

  const handleFileUploaded = (uploadedData) => {
    setLoading(true);
    try {
      console.log('Handling file upload:', uploadedData);
      // Basic validation/cleaning could go here
      // Ensure the uploaded data has the expected structure
       const validatedData = {
        headerInfo: uploadedData.headerInfo || { name: '', currentPosition: '', summary: '' },
        contactInfo: uploadedData.contactInfo || {
          email: { value: '', displayValue: '', icon: 'fa fa-envelope' },
          phone: { value: '', displayValue: '', icon: 'fa fa-phone' },
          linkedin: { value: '', displayValue: '', icon: 'fa fa-linkedin' }
        },
        workExperience: uploadedData.workExperience || {},
        education: uploadedData.education || {},
        achievements: uploadedData.achievements || [],
        skills: uploadedData.skills || [],
        projects: uploadedData.projects || []
      };
      setResumeData(validatedData);
      localStorage.setItem('resumeData', JSON.stringify(validatedData));
    } catch (error) {
      console.error('Error processing uploaded file:', error);
    } finally {
      setTimeout(() => setLoading(false), 10);
    }
  };

  // Generic update function passed to the form
  const handleResumeDataChange = useCallback((updatedSectionData) => {
    console.log("Resume data updated via form with section:", updatedSectionData);
    
    setResumeData(prevData => {
      // Merge the updated section into the previous state
      const updatedData = { ...(prevData || {}), ...updatedSectionData };
      localStorage.setItem('resumeData', JSON.stringify(updatedData));
      return updatedData; 
    });
  }, []);

  const increaseFontSize = () => {
    setFontSizeScale(prev => Math.min(prev + 0.05, 1.3));
  };

  const decreaseFontSize = () => {
    setFontSizeScale(prev => Math.max(prev - 0.05, 0.7));
  };

  const resetFontSize = () => {
    setFontSizeScale(1);
  };

  // Handle print with current font scale
  const handlePrint = () => {
    if(showEditor) {
      toggleEditor();
    }
    // Ensure font scale is applied before printing
    document.documentElement.style.setProperty('--print-font-scale', fontSizeScale);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  // Reformat and SORT data for display components
  const getFormattedDataForDisplay = () => {
    if (!resumeData) return null;
    const headerInfo = resumeData.headerInfo || {};
    const contactInfo = resumeData.contactInfo || {};
    const workExperienceObj = resumeData.workExperience || {};

    // Sort work experience entries
    const sortedWorkExperienceArray = Object.entries(workExperienceObj)
      .sort(([, jobA], [, jobB]) => {
        const dateA = parseSortableDate(jobA.toDate);
        const dateB = parseSortableDate(jobB.toDate);
        
        // Sort descending by toDate (Present is Infinity)
        if (dateB !== dateA) {
           return dateB - dateA;
        } 
        
        // If toDates are the same, sort descending by fromDate
        const fromDateA = parseSortableDate(jobA.fromDate);
        const fromDateB = parseSortableDate(jobB.fromDate);
        return fromDateB - fromDateA;
      });

    return {
      header: { header: headerInfo, contact: contactInfo },
      // Pass the sorted array to the WorkExperience component
      workExperienceArray: sortedWorkExperienceArray, 
      education: resumeData.education || {},
      achievements: resumeData.achievements || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || []
    };
  };

  const displayData = getFormattedDataForDisplay();

  return (
    <div className={`resume-wrapper ${showEditor ? 'with-editor' : ''}`} data-font-scale={fontSizeScale}>
      <div className="resume-controls">
        <DownloadTemplate templateData={resumeData} />
        <FileUpload onFileUploaded={handleFileUploaded} />
        <div className="font-size-controls">
          <button className="font-button" onClick={decreaseFontSize} title="Decrease font size">
            <i className="fa fa-font"></i>-
          </button>
          <span className="font-size-indicator">{Math.round(fontSizeScale * 100)}%</span>
          <button className="font-button" onClick={increaseFontSize} title="Increase font size">
            <i className="fa fa-font"></i>+
          </button>
          <button className="font-button" onClick={resetFontSize} title="Reset font size">
            <i className="fa fa-refresh"></i>
          </button>
        </div>
        <button className="font-button edit-button" onClick={toggleEditor}>
          <i className="fa fa-pencil"></i> {showEditor ? 'Hide Editor' : 'Edit Resume'}
        </button>
        <button className="font-button print-button-custom" onClick={handlePrint} title="Print with current settings">
          <i className="fa fa-print"></i> Print Resume
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : displayData ? (
        <div className="content-wrapper">
          <div id="Resume" className="print-friendly">
            <Header data={displayData.header} />
            <Education data={displayData.education} />
            <WorkExperience data={displayData.workExperienceArray} />
            <Achievement data={displayData.achievements} />
            <Projects data={displayData.projects} />
            <Skills data={displayData.skills} />
          </div>
          
          {showEditor && resumeData && (
            <ResumeForm 
              initialData={resumeData} // Pass the single source of truth 
              onDataChange={handleResumeDataChange} // Pass the single update function
              onClose={toggleEditor}
            />
          )}
        </div>
      ) : (
        <div className="error-container">Error loading resume data</div>
      )}
    </div>
  );
};

export default Resume;
