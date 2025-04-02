import React from 'react';
import './Projects.css';
import Heading from '../Heading/Heading';

const Projects = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div id='Projects'>
      <Heading heading='Projects' />
      <div className="projects-list">
        {data.map((project, index) => (
          <div key={index} className="project-item">
            <div className='title'>{project.title}</div>
            <div className='detail'>{project.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
