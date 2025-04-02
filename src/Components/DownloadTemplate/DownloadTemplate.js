import React from 'react';
import { downloadTemplate } from '../../Utility/TemplateHandler';
import './DownloadTemplate.css';

const DownloadTemplate = (props) => {
  const {templateData} = props;
  return (
    <div className="download-template-container">
      <button 
        className="download-button" 
        onClick={() => downloadTemplate(templateData)}
      >
        <i className="fa fa-download"></i>
        Save Data
      </button>
    </div>
  );
};

export default DownloadTemplate; 