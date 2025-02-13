import React from "react"; 
import { FaHome, FaThumbsUp, FaRegStar, FaUsers } from "react-icons/fa"; // Importing icons
import "./App.css";

function App() {
  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="header">
        <nav className="navbar">
          <h1>HackTok</h1>
          <ul>
            <li>
              <a href="#home">
                <FaHome className="icon" /> Home
              </a>
            </li>
            <li>
              <a href="#about">
                <FaThumbsUp className="icon" /> Features
              </a>
            </li>
            <li>
              <a href="#signup">
                <FaUsers className="icon" /> Join
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to HackTok</h2>
          <p>Discover, Laugh, and Vote on the Most Outrageous Life Hacks!</p>
          <a href="#about" className="cta-button">
            Get Started
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-content">
          <h2>What is HackTok?</h2>
          <div className="about-image">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMNudnQPh-nNjMXISQXMiwsSU3Gz-Sbue8AQ&s" alt="Life Hacks" />
          </div>
          <p>
            HackTok is a fun, community-driven platform where users submit the
            most impractical life hacks. It's all about creativity, humor, and
            having a good time!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <h2>Key Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <FaThumbsUp size={50} color="#F39C12" />
              <h3>Vote on Hacks</h3>
              <p>Cast your vote for the most entertaining hacks!</p>
            </div>
            <div className="feature-item">
              <FaRegStar size={50} color="#F39C12" />
              <h3>Submit Your Hacks</h3>
              <p>Share your own creative hacks with the world!</p>
            </div>
            <div className="feature-item">
              <FaUsers size={50} color="#F39C12" />
              <h3>Join the Community</h3>
              <p>Interact with users and share laughs together!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <p>Ready to join the funniest hack community?</p>
        <a href="#signup" className="cta-button">
          Join Now
        </a>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2025 HackTok. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
