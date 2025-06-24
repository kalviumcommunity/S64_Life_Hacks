import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HacksPage from "./pages/HacksPage";
import AddHackPage from "./pages/AddHackPage";
import UpdateHackPage from "./pages/UpdateHackPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Hacks page - now public */}
        <Route path="/hacks" element={<HacksPage />} />
        <Route 
          path="/add-hack" 
          element={
            <ProtectedRoute>
              <AddHackPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/update-hack/:id" 
          element={
            <ProtectedRoute>
              <UpdateHackPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
