import './App.css';

import React from "react";

const Services = () => {
    const services = [
        {
            title: "Weddings & Celebrations",
            description:
                "Your love story deserves to be told beautifully. I capture the genuine laughter, tender moments, and joyful celebrations that make your day uniquely yours. As a second shooter or supporting photographer, I ensure every precious detail is preserved — from the quiet glances to the dance floor magic.",
            icon: "💍",
            features: ["Natural, candid moments", "Comprehensive coverage", "Timeless memories"]
        },
        {
            title: "Vacation & Lifestyle Photography",
            description:
                "Make your Virgin Islands getaway unforgettable with stunning photos that capture both the paradise around you and the joy you're feeling. Perfect for families, couples, or anyone wanting to remember their island adventure with professional, relaxed portraits.",
            icon: "🌴",
            features: ["Relaxed photo sessions", "Beautiful island backdrops", "Authentic storytelling"]
        },
        {
            title: "Real Estate & Vacation Rentals",
            description:
                "Transform your property into a booking magnet with photos that showcase its true potential. I create inviting images that help guests envision their perfect stay, leading to more inquiries and higher booking rates for your Airbnb or rental property.",
            icon: "🏠",
            features: ["Professional staging tips", "High-impact listings", "Proven booking increase"]
        },
        {
            title: "Business & Brand Photography",
            description:
                "Show your business personality through compelling visuals that connect with customers. From restaurant dishes to retail products, I help local businesses shine online with photography that reflects your authentic island spirit and professional quality.",
            icon: "📸",
            features: ["Social media ready", "Brand storytelling", "Professional web images"]
        },
        {
            title: "Aerial & Scenic Views",
            description:
                "See the Virgin Islands from a whole new perspective. My aerial photography adds breathtaking drama to your wedding, showcases your property's stunning location, or simply captures the incredible beauty of island life from above.",
            icon: "🚁",
            features: ["Unique perspectives", "Stunning landscapes", "Property showcasing"]
        },
    ];

    return (
        <div className="services-container">
            {/* Header Section */}
            <div className="services-header">
                <div className="header-content">
                    <h1 className="main-title">
                        Capturing Life's Beautiful Moments
                    </h1>
                    <div className="title-accent"></div>
                    <p className="subtitle">
                        Professional photography services in the Virgin Islands, specializing in weddings, lifestyle, and business photography that tells your unique story.
                    </p>
                </div>
            </div>

            <div className="services-content">
                {/* Services Grid */}
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="card-glow"></div>

                            <div className="service-number">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <div className="service-content">
                                <div className="service-icon">
                                    <span>{service.icon}</span>
                                </div>

                                <h2 className="service-title">
                                    {service.title}
                                </h2>

                                <p className="service-description">
                                    {service.description}
                                </p>

                                <div className="service-features">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="feature-item">
                                            <div className="feature-dot"></div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <button className="learn-more-btn">
                                    View Portfolio
                                    <span className="arrow">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Value Proposition */}
                <div className="value-section">
                    <div className="value-content">
                        <h3 className="value-title">Why Choose Island Moments Photography?</h3>
                        <p className="value-subtitle">
                            Local expertise meets professional quality. I understand the unique beauty of the Virgin Islands and know exactly how to capture your special moments in this tropical paradise.
                        </p>

                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-number">150+</div>
                                <div className="stat-label">Happy Couples</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Events Captured</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">3+</div>
                                <div className="stat-label">Islands Covered</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="cta-section">
                    <h3 className="cta-title">Ready to Create Beautiful Memories?</h3>
                    <p className="cta-subtitle">
                        Let's chat about your vision and how I can help bring it to life. Every great photo session starts with a conversation.
                    </p>

                    <div className="cta-buttons">
                        <a href="/contact" className="primary-btn">
                            Get In Touch
                        </a>
                        <a href="/portfolio" className="secondary-btn">
                            View My Work
                        </a>
                    </div>

                    <div className="cta-note">
                        <div className="available-dot"></div>
                        Currently booking for 2025 • Quick response guaranteed
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;