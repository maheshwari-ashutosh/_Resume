import React, { useRef } from 'react';
import { handleFileUpload } from '../../Utility/TemplateHandler';
import './FileUpload.css';

const FileUpload = ({ onFileUploaded }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      try {
        const data = await handleFileUpload(file);
        onFileUploaded(data);
      } catch (error) {
        alert(error.message);
      }
      
      // Reset the file input to allow uploading the same file again
      e.target.value = '';
    }
  };

  return (
    <div className="file-upload-container">
      <button 
        className="upload-button" 
        onClick={handleClick}
      >
        <i className="fa fa-upload"></i>
        Upload Resume Data
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept=".json"
      />
    </div>
  );
};

export default FileUpload; 