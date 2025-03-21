import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import SkillList from './pages/SkillList';
import SkillDetail from './pages/SkillDetail';
import SkillExport from './pages/SkillExport';
import VideoSearch from './pages/VideoSearch/VideoSearch';
import VideoDetail from './pages/VideoSearch/VideoDetail';
import VideoUpload from './pages/VideoUpload/VideoUpload';
import Marketplace from './pages/Marketplace';
import ListingDetail from './pages/Marketplace/ListingDetail';
import CreateListing from './pages/Marketplace/CreateListing';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<SkillList />} />
            <Route path="/skills/:skillId" element={<SkillDetail />} />
            <Route path="/export" element={<SkillExport />} />
            <Route path="/videos/search" element={<VideoSearch />} />
            <Route path="/videos/:videoId" element={<VideoDetail />} />
            <Route path="/videos/upload" element={<VideoUpload />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/listings/:listingId" element={<ListingDetail />} />
            <Route path="/marketplace/create" element={<CreateListing />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
