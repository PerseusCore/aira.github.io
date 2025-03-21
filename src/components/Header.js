import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [videoDropdownOpen, setVideoDropdownOpen] = useState(false);
  const [marketplaceDropdownOpen, setMarketplaceDropdownOpen] = useState(false);

  const toggleVideoDropdown = () => {
    setVideoDropdownOpen(!videoDropdownOpen);
    if (marketplaceDropdownOpen) setMarketplaceDropdownOpen(false);
  };

  const toggleMarketplaceDropdown = () => {
    setMarketplaceDropdownOpen(!marketplaceDropdownOpen);
    if (videoDropdownOpen) setVideoDropdownOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            AIRA Robot Skill Export
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/skills">
                  My Skills
                </NavLink>
              </li>
              <li className={`nav-item dropdown ${videoDropdownOpen ? 'show' : ''}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="videoDropdown"
                  role="button"
                  onClick={toggleVideoDropdown}
                  aria-expanded={videoDropdownOpen}
                >
                  Videos
                </a>
                <ul 
                  className={`dropdown-menu ${videoDropdownOpen ? 'show' : ''}`} 
                  aria-labelledby="videoDropdown"
                  style={{ display: videoDropdownOpen ? 'block' : 'none' }}
                >
                  <li>
                    <NavLink className="dropdown-item" to="/videos/search" onClick={() => setVideoDropdownOpen(false)}>
                      AI Video Search
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/videos/upload" onClick={() => setVideoDropdownOpen(false)}>
                      Upload Video
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className={`nav-item dropdown ${marketplaceDropdownOpen ? 'show' : ''}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="marketplaceDropdown"
                  role="button"
                  onClick={toggleMarketplaceDropdown}
                  aria-expanded={marketplaceDropdownOpen}
                >
                  Marketplace
                </a>
                <ul 
                  className={`dropdown-menu ${marketplaceDropdownOpen ? 'show' : ''}`} 
                  aria-labelledby="marketplaceDropdown"
                  style={{ display: marketplaceDropdownOpen ? 'block' : 'none' }}
                >
                  <li>
                    <NavLink className="dropdown-item" to="/marketplace" onClick={() => setMarketplaceDropdownOpen(false)}>
                      Browse Skills
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/marketplace/create" onClick={() => setMarketplaceDropdownOpen(false)}>
                      Create Listing
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/export">
                  Export
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
