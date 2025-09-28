// About.js
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Award, MapPin, Mail } from 'lucide-react';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="about-container"
        >
            <div className="about-hero">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="about-content"
                >
                    <h1>About Charley Marie</h1>
                    <p>Visual storyteller capturing moments that matter</p>
                </motion.div>
            </div>

            <div className="about-sections">
                <motion.section
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="about-section"
                >
                    <h2>My Journey</h2>
                    <p>
                        With over 8 years of professional photography experience,
                        I specialize in landscape, nature, and urban photography.
                        My work has been featured in numerous exhibitions and publications.
                    </p>
                </motion.section>

                <motion.section
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="about-section"
                >
                    <h2>Philosophy</h2>
                    <p>
                        I believe in capturing the extraordinary in ordinary moments,
                        transforming fleeting instances into timeless visual stories
                        through the perfect interplay of light, composition, and emotion.
                    </p>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default About;