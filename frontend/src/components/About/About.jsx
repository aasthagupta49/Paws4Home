import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
    const navigate = useNavigate();
    const slogans = [
        {
            text: "Every Pet Deserves a Loving Home",
            description: "We believe in creating perfect matches between pets and families.",
            icon: "🏠"
        },
        {
            text: "Paws Today, Love Forever",
            description: "Experience the unconditional love that only a pet can bring to your life.",
            icon: "💝"
        },
        {
            text: "Where Hearts and Paws Connect",
            description: "Building bridges between loving homes and pets in need.",
            icon: "🐾"
        },
        {
            text: "Give Love, Get Love",
            description: "Open your heart and home to a furry friend who will love you unconditionally.",
            icon: "❤️"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-container">
            <section className="hero-section">
                <div className="hero-split">
                    <div className="hero-content">
                        <h1>Finding Forever <span className="highlight">Homes</span></h1>
                        <p className="hero-description">
                            Welcome to Paws4Home, where every tail finds its happy ending. We're more than just a pet adoption platform – 
                            we're matchmakers for furry friends and loving families.
                        </p>
                        <div className="hero-buttons">
                            <button 
                                className="primary-button"
                                onClick={() => navigate('/adopt')}
                            >
                                Start Adoption Journey
                            </button>
                            <button className="secondary-button">Learn More</button>
                        </div>
                        <div className="hero-features">
                            <div className="feature">
                                <span className="feature-icon">🏠</span>
                                <span>Trusted Homes</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">💖</span>
                                <span>Loving Care</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🤝</span>
                                <span>Expert Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e" 
                            alt="Happy dog with family"
                            className="hero-img"
                        />
                    </div>
                </div>
            </section>

            <section className="image-section fade-in">
                <div className="image-container">
                    <div className="image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1570018144715-43110363d70a" 
                            alt="Person bonding with cat" 
                            className="about-image" 
                        />
                        <div className="image-overlay">
                            <p>"Creating bonds that last a lifetime"</p>
                        </div>
                    </div>
                </div>
                <div className="image-container">
                    <div className="image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1589941013453-ec89f33b5e95" 
                            alt="German Shepherd" 
                            className="about-image" 
                        />
                        <div className="image-overlay">
                            <p>"Loyalty and love in their purest form"</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="slogan-section fade-in">
                <h2>Our Core Values</h2>
                <div className="slogan-grid">
                    {slogans.map((slogan, index) => (
                        <div key={index} className="slogan-card">
                            <div className="slogan-icon">{slogan.icon}</div>
                            <h3>{slogan.text}</h3>
                            <p>{slogan.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mission-section fade-in">
                <div className="mission-content">
                    <div className="mission-header">
                        <span className="mission-icon">🎯</span>
                        <h2>Our Mission</h2>
                    </div>
                    <div className="mission-grid">
                        <div className="mission-card">
                            <div className="mission-card-header">
                                <span className="card-icon">🏠</span>
                                <h3>Finding Perfect Homes</h3>
                            </div>
                            <p>
                                At Paws4Home, we believe that every pet deserves a loving home and every home deserves 
                                the joy that a pet brings. Our platform serves as a bridge between caring individuals 
                                and pets in need.
                            </p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-card-header">
                                <span className="card-icon">💝</span>
                                <h3>Promoting Responsible Care</h3>
                            </div>
                            <p>
                                We're committed to promoting responsible pet ownership and supporting animal welfare, 
                                ensuring both pets and their humans can thrive together in lasting relationships.
                            </p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-card-header">
                                <span className="card-icon">🤝</span>
                                <h3>Building Community</h3>
                            </div>
                            <p>
                                We're creating a supportive community where pet lovers can connect, share experiences, 
                                and help each other in the journey of pet adoption and care.
                            </p>
                        </div>
                    </div>
                    <div className="mission-cta">
                        <p className="cta-text">Ready to make a difference in a pet's life?</p>
                        <button 
                            className="cta-button"
                            onClick={() => navigate('/adopt')}
                        >
                            Start Adoption Journey
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
