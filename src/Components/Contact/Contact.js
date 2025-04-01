import React from 'react';
import './Contact.css';

import ContactTile from './ContactTile';

const Contact = (props) => {
  const contactInfo = props.data;
  return (
    <div className='d-flex column flex-wrap justify-content-between' id='Contact'>
      {Object.keys(contactInfo).map((key) => {
        return <ContactTile key={key} contact={contactInfo[key]} />;
      })}
    </div>
  );
};

export default Contact;
