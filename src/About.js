import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, MapPin, Award, Users, Calendar } from 'lucide-react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import './App.css';
import { db } from './firebase'



const s3Client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
});


const About = () => {
    const [aboutImages, setAboutImages] = useState({ bannerImg: '', aboutmeImg: '' });
    const [isUploading, setIsUploading] = useState(false);

    // Fetch existing images on component mount
    useEffect(() => {
        fetchAboutImages();
    }, []);

    const fetchAboutImages = async () => {
        try {
            const docRef = doc(db, 'aboutImages', 'images');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setAboutImages(docSnap.data());
            }
        } catch (error) {
            console.error('Error fetching about images:', error);
        }
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadAboutImage(file);
            }
        };
        input.click();
    };

    const uploadAboutImage = async (file) => {
        try {
            setIsUploading(true);

            const fileName = `about-images/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

            // Convert file to ArrayBuffer first, then to Uint8Array
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const uploadParams = {
                Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
                Key: fileName,
                Body: uint8Array,
                ContentType: file.type,
            };


            await s3Client.send(new PutObjectCommand(uploadParams));
            const s3Url = `https://${process.env.REACT_APP_AWS_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${fileName}`;


            // Update the aboutmeImg in the aboutImages object
            const updatedImages = {
                ...aboutImages,
                aboutmeImg: s3Url
            };

            // Save to Firestore
            await setDoc(doc(db, 'aboutImages', 'images'), updatedImages);

            // Update local state
            setAboutImages(updatedImages);


        } catch (error) {
            console.error('Error uploading about image:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            alert('Error uploading image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const achievements = [
        {
            icon: <Camera className="achievement-icon" />,
            number: "200+",
            label: "Weddings Captured",
            description: "Beautiful love stories documented"
        },
        {
            icon: <Heart className="achievement-icon" />,
            number: "5 Years",
            label: "Island Experience",
            description: "Deep local knowledge"
        },
        {
            icon: <Users className="achievement-icon" />,
            number: "500+",
            label: "Happy Clients",
            description: "Couples who trusted their day with me"
        },
        {
            icon: <Award className="achievement-icon" />,
            number: "Featured",
            label: "Published Work",
            description: "In wedding magazines & blogs"
        }
    ];

    const personalDetails = [
        {
            icon: <MapPin className="detail-icon" />,
            title: "Based in Paradise",
            description: "Living and working across St. Thomas, St. John, and St. Croix"
        },
        {
            icon: <Calendar className="detail-icon" />,
            title: "Always Ready",
            description: "Available for destination weddings and local celebrations"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="about-container"
        >
            {/* Hero Section */}
            <div className="about-hero">
                <div
                    className="hero-background"
                    style={aboutImages.bannerImg ? {
                        backgroundImage: `url(${aboutImages.bannerImg})`
                    } : {}}
                ></div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="about-hero-content"
                >
                    <div className="hero-badge">
                        <Camera size={20} />
                        <span>Professional Photographer</span>
                    </div>
                    <h1 className="hero-title" style={{ textTransform: 'uppercase' }}>Hi! Im Charley Marie</h1>
                    <p className="hero-subtitle">
                        Your island photographer who believes every story deserves to be told beautifully against the backdrop of paradise.
                    </p>
                    <div className="hero-location">
                        <MapPin size={18} />
                        <span>Virgin Islands • Available Worldwide</span>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="about-content-wrapper">

                {/* Personal Story Section */}
                <motion.section
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="story-section"
                >
                    <div className="story-content">
                        <div className="story-text">
                            <h2 className="section-title">My Story</h2>
                            <div className="story-paragraphs">
                                <p>
                                    Five years ago, I fell in love with the Virgin Islands – not just for the stunning sunsets and crystal-clear waters, but for the way love feels here. There's something magical about couples who choose to celebrate their union in paradise.
                                </p>
                                <p>
                                    As a photographer, I've learned that the best photos happen in those unguarded moments between the planned shots. The quiet laugh shared during your first look, the way your grandmother tears up during the ceremony, the pure joy on the dance floor as the sun sets behind you.
                                </p>
                                <p>
                                    I'm not just your photographer – I'm your island guide, your timeline keeper, and sometimes your biggest cheerleader. My goal is simple: capture your authentic love story so you can relive these precious moments forever.
                                </p>
                            </div>
                        </div>
                        <div className="story-image">
                            {aboutImages.aboutmeImg ? (
                                <div
                                    className="story-image-loaded"
                                    style={{
                                        backgroundImage: `url(${aboutImages.aboutmeImg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <div className="image-overlay">
                                        <button
                                            onClick={handleImageUpload}
                                            className="change-image-btn"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? 'Uploading...' : 'Change Photo'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="image-placeholder"
                                    onClick={handleImageUpload}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Camera size={60} />
                                    <span>{isUploading ? 'Uploading...' : 'Your Photo Here'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Achievements Grid */}
                <motion.section
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="achievements-section"
                >
                    {/* <h2 className="section-title centered">Why Couples Choose Me</h2>
                    <div className="achievements-grid">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="achievement-card"
                            >
                                <div className="achievement-icon-wrapper">
                                    {achievement.icon}
                                </div>
                                <div className="achievement-number">{achievement.number}</div>
                                <div className="achievement-label">{achievement.label}</div>
                                <div className="achievement-description">{achievement.description}</div>
                            </motion.div>
                        ))}
                    </div> */}
                </motion.section>

                {/* Philosophy Section */}
                <motion.section
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="philosophy-section"
                >
                    <div className="philosophy-content">
                        <h2 className="section-title">My Approach</h2>
                        <div className="philosophy-grid">
                            <div className="philosophy-card">
                                <h3>Authentic Moments</h3>
                                <p>I capture real emotions, genuine laughter, and those tender glances that happen when you think no one's watching.</p>
                            </div>
                            <div className="philosophy-card">
                                <h3>Island Expertise</h3>
                                <p>From hidden beaches to perfect sunset spots, I know exactly where and when to capture the Virgin Islands' natural beauty.</p>
                            </div>
                            <div className="philosophy-card">
                                <h3>Stress-Free Experience</h3>
                                <p>Your wedding day should be about celebrating love, not worrying about photos. I handle all the details so you can be present.</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Personal Details */}
                <motion.section
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="details-section"
                >
                    <div className="details-grid">
                        {personalDetails.map((detail, index) => (
                            <div key={index} className="detail-card">
                                <div className="detail-icon-wrapper">
                                    {detail.icon}
                                </div>
                                <div className="detail-content">
                                    <h3 className="detail-title">{detail.title}</h3>
                                    <p className="detail-description">{detail.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="about-cta-section"
                >
                    <div className="cta-content">
                        <h2 className="cta-title" style={{ color: "whitesmoke" }}>Ready to Create Magic Together?</h2>
                        <p className="cta-subtitle" style={{ color: "whitesmoke" }}>
                            I'd love to hear about your vision and help bring your dream wedding to life in paradise.
                        </p>
                        <div className="cta-buttons">
                            <a href="/contact" className="primary-cta-btn">
                                Let's Chat About Your Day
                            </a>
                            <a href="/" className="secondary-cta-btn">
                                View My Portfolio
                            </a>
                        </div>
                        <div className="cta-note">
                            <div className="available-indicator"></div>
                            <p style={{ color: 'white' }}>
                                Currently booking 2025 weddings • Free consultation included

                            </p>
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default About;