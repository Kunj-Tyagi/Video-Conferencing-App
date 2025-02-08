import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPages from './pages/landing';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<LandingPages />} />
      </Routes>
    </Router>

  );
}

export default App;
