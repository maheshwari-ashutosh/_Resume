import React from 'react';
import './Projects.css';
import Heading from '../Heading/Heading';

const Projects = (props) => {
  const projects = props.data;
  return (
    <div id='Projects'>
      <Heading heading='Projects' />
      {projects.map((project) => {
        return (
          <div key={project.title} className='project'>
            <div className='title'>{project.title}</div>
            <div className='detail'>{project.detail}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Projects;
