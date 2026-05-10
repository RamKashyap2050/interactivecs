import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import DSASection from './pages/DSASection';
import SystemDesignSection from './pages/SystemDesignSection';
import AlgorithmDetail from './pages/AlgorithmDetail';
import CaseStudiesSection from './pages/CaseStudiesSection';
import CaseStudyDetail from './pages/CaseStudyDetail';
import DatabasesHome from './pages/DatabasesHome';
import SQLModule from './pages/SQLModule';
import NoSQLModule from './pages/NoSQLModule';
import GraphDBModule from './pages/GraphDBModule';

function App() {
  return (
    <Router>
      <div className="bg-[#050d1a] min-h-screen text-[#f3f4f6] font-source selection:bg-[var(--color-electric-cyan)] selection:text-[#050d1a]">
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ml" element={<Home />} />
          <Route path="/dsa" element={<DSASection />} />
          <Route path="/system-design" element={<SystemDesignSection />} />
          <Route path="/databases" element={<DatabasesHome />} />
          <Route path="/databases/sql" element={<SQLModule />} />
          <Route path="/databases/nosql" element={<NoSQLModule />} />
          <Route path="/databases/graph" element={<GraphDBModule />} />
          <Route path="/case-studies" element={<CaseStudiesSection />} />
          <Route path="/case-study/:slug" element={<CaseStudyDetail />} />
          <Route path="/algorithm/:slug" element={<AlgorithmDetail />} />
          <Route path="/topic/:slug" element={<AlgorithmDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
