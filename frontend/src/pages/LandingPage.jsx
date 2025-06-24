import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaThumbsUp, 
  FaRegStar, 
  FaUsers, 
  FaShareAlt, 
  FaTools, 
  FaTimesCircle, 
  FaLightbulb, 
  FaRocket, 
  FaTwitter, 
  FaInstagram 
} from "react-icons/fa";
import "../styles/LandingPage.css";

const LandingPage = () => {
  useEffect(() => {
    // Add scroll animation for elements
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.feature-item, .hack-item, .testimonial, .category-item');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
          element.classList.add('animate');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    // Initial check
    animateOnScroll();
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
  
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
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to HackTok</h2>
          <p>Discover, Laugh, and Vote on the Most Outrageous Life Hacks!</p>
          <div className="button-group">
            <a href="#about" className="cta-button">
              Get Started
            </a>
            <Link to="/hacks" className="cta-button hacks-button">
              Explore Hacks
            </Link>
          </div>
        </div>
        {/* Featured Categories */}
        <section className="categories">
          <h2>Featured Categories</h2>
          <div className="category-list">
            <div className="category-item">
              <FaLightbulb />
              <h3>Genius Hacks</h3>
            </div>
            <div className="category-item">
              <FaTimesCircle />
              <h3>Epic Fails</h3>
            </div>
            <div className="category-item">
              <FaRegStar />
              <h3>DIY Gone Wrong</h3>
            </div>
          </div>
        </section>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-content">
          <h2>What is HackTok?</h2>
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Life Hacks"
            />
          </div>
          <p>
            HackTok is a fun, community-driven platform where users submit the
            most impractical life hacks. It's all about creativity, humor, and
            having a good time! Join thousands of users who are already sharing
            and laughing at the most outrageous DIY solutions.
          </p>
        </div>
      </section>

      {/* Trending Hacks Section */}
      <section className="trending-hacks">
        <h2>Trending Hacks</h2>
        <div className="hack-list">
          <div className="hack-item">
            <span className="hack-emoji">🔥</span>
            <h3>Toothpaste as a Car Scratch Remover</h3>
            <p className="hack-votes">1.2K votes</p>
          </div>
          <div className="hack-item">
            <span className="hack-emoji">⚡</span>
            <h3>Charging Your Phone with an Onion</h3>
            <p className="hack-votes">987 votes</p>
          </div>
          <div className="hack-item">
            <span className="hack-emoji">💡</span>
            <h3>DIY Spoon Phone Stand</h3>
            <p className="hack-votes">756 votes</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <h2>Key Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <FaThumbsUp size={60} />
              <h3>Vote on Hacks</h3>
              <p>Cast your vote for the most entertaining and outrageous hacks from around the world!</p>
            </div>
            <div className="feature-item">
              <FaRocket size={60} />
              <h3>Submit Your Hacks</h3>
              <p>Share your own creative (or hilariously impractical) hacks with our growing community!</p>
            </div>
            <div className="feature-item">
              <FaUsers size={60} />
              <h3>Join the Community</h3>
              <p>Connect with like-minded hack enthusiasts and share laughs over the most absurd solutions!</p>
            </div>
          </div>
        </div>
      </section>


      {/* User Testimonials */}
      <section className="testimonials">
        <h2>What Users Are Saying</h2>
        <div className="testimonial-container">
          <div className="testimonial">
            <p>"HackTok made my day! The funniest hacks I've ever seen. I spend hours scrolling through new content every day! 😂"</p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div className="author-name">Alex T.</div>
            </div>
          </div>
          <div className="testimonial">
            <p>"I tried a hack from this site... it failed miserably, but I laughed so hard that it was totally worth it! Now I'm addicted to finding the most ridiculous ones."</p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-name">Sarah M.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Share Section */}
      <section className="social-share">
        <h2>Share the Fun!</h2>
        <p>Spread the funniest hacks with your friends!</p>
        <div className="share-buttons">
          <button className="share-button"><FaTwitter /> Share on Twitter</button>
          <button className="share-button"><FaInstagram /> Share on Instagram</button>
        </div>
        <div className="social-stats">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5K+</span>
            <span className="stat-label">Hacks Shared</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Monthly Views</span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Explore?</h2>
          <p>Check out our amazing collection of life hacks!</p>
          <div className="cta-buttons">
            <Link to="/hacks" className="cta-button">
              Explore Hacks
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">HackTok</div>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
           <p>© 2025 HackTok. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;