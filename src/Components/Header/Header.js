import React from 'react';
import './Header.css';
import Contact from '../Contact/Contact';

const Header = (props) => {
  const headerInfo = props.data.header;
  const contactInfo = props.data.contact;
  const {name, currentPosition, ...rest} = headerInfo;
  return (
    <div>
    <div class="d-flex justify-space-between">
    <div id='Header'>
      <h1>{name}</h1>
      <h2>{currentPosition}</h2>
    </div>
    <Contact data={contactInfo} />
    </div>
    {Object.keys(rest).map((key) => {
      return <p key={key}>{rest[key]}</p>;
    })}
    </div>
  );
};

export default Header;
