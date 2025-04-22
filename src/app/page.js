"use client"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Homepage from '../pages/Homepage';
import Footer from '../components/Footer';
import Dashboard from '../pages/DashBoard';

export default function Home() {
  return (
    <Router>
      <div className="landing-container">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}