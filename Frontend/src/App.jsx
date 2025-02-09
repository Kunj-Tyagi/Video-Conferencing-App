import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPages from "./pages/landing";
import Authentication from "./pages/authenication";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPages />} />
          <Route path="/auth" element={<Authentication />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
