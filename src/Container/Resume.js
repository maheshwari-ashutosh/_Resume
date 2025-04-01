import React, { useEffect, useState } from "react";
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

const Resume = (props) => {
  let [data, setData] = useState(null);
  let [customData, setCustomData] = useState(null);
  let [loading, setLoading] = useState(true);
  let [fontSizeScale, setFontSizeScale] = useState(1); // Default scale factor

  useEffect(() => {
    try {
      const resumeData = loadData(customData);
      console.log('Loaded resume data:', resumeData);
      setData(resumeData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [customData]);

  // Set CSS variable when font scale changes
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontSizeScale);
  }, [fontSizeScale]);

  const handleFileUploaded = (uploadedData) => {
    setLoading(true);
    
    // Ensure complete data structure with deep structure validation
    const completeData = {
      headerInfo: {
        name: uploadedData.headerInfo?.name || "Your Name",
        currentPosition: uploadedData.headerInfo?.currentPosition || "Your Job Title",
        summary: uploadedData.headerInfo?.summary || "Your professional summary",
      },
      contactInfo: {
        email: {
          value: uploadedData.contactInfo?.email?.value || "mailto:email@example.com",
          displayValue: uploadedData.contactInfo?.email?.displayValue || "email@example.com",
          icon: "fa fa-envelope",
        },
        phone: {
          value: uploadedData.contactInfo?.phone?.value || "tel:phone-number",
          displayValue: uploadedData.contactInfo?.phone?.displayValue || "phone-number",
          icon: "fa fa-phone",
        },
        linkedin: {
          value: uploadedData.contactInfo?.linkedin?.value || "https://www.linkedin.com/in/linkedin-profile-url",
          displayValue: uploadedData.contactInfo?.linkedin?.displayValue || "linkedin.com/in/linkedin-profile-url",
          icon: "fa fa-linkedin",
        },
      },
      workExperience: uploadedData.workExperience || {},
      education: uploadedData.education || {},
      achievements: uploadedData.achievements || [],
      skills: uploadedData.skills || [],
      projects: uploadedData.projects || []
    };
    
    // Apply after a short delay to ensure DOM update
    setTimeout(() => {
      setCustomData(completeData);
    }, 10);
  };

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
    // Ensure font scale is applied before printing
    document.documentElement.style.setProperty('--print-font-scale', fontSizeScale);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="resume-wrapper print-friendly" data-font-scale={fontSizeScale}>
      <div className="resume-controls">
        <DownloadTemplate />
        <FileUpload onFileUploaded={handleFileUploaded} />
        <button className="font-button print-button-custom" onClick={handlePrint} title="Print with current settings">
          <i className="fa fa-print"></i> Print Resume
        </button>
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
        
      </div>
      
      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : data ? (
        <div id="Resume">
          <Header data={data.header} />
          <Education data={data.education} />
          <WorkExperience data={data.workExperience} />
          <Achievement data={data.achievements} />
          <Projects data={data.projects} />
          <Skills data={data.skills} />
        </div>
      ) : (
        <div className="error-container">Error loading resume data</div>
      )}
    </div>
  );
};

export default Resume;
