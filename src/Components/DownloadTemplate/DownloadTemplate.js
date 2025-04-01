import React from 'react';
import { downloadTemplate } from '../../Utility/TemplateHandler';
import './DownloadTemplate.css';

const DownloadTemplate = () => {
  return (
    <div className="download-template-container">
      <button 
        className="download-button" 
        onClick={downloadTemplate}
      >
        <i className="fa fa-download"></i>
        Download Template
      </button>
    </div>
  );
};

export default DownloadTemplate; 