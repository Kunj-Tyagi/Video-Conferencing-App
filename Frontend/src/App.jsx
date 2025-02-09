import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPages from "./pages/landing";
import Authentication from "./pages/authenication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./pages/videomeet";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPages />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path='/:url' element={<VideoMeetComponent/>} /> {/* like localhost:3000/1123 :- 1123 is the Room-Id */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
