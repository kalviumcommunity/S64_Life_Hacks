import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HacksPage from "./pages/HacksPage"; // Updated import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hacks" element={<HacksPage />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;
