import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            AIRA Robot Skill Export
          </div>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/videos/search">AI Video Search</Link>
            </li>
            <li>
              <Link to="/marketplace">Marketplace</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} AIRA Robot Skill Export. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
