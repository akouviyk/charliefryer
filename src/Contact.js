// Contact.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="contact-container"
        >
            <div className="contact-hero">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    Get In Touch
                </motion.h1>
            </div>

            <div className="contact-content">
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="contact-info"
                >
                    <h2>Let's Create Something Beautiful</h2>
                    <div className="contact-details">
                        <div className="contact-item">
                            <Mail size={20} />
                            <span>hello@charleymarie.com</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={20} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="contact-item">
                            <MapPin size={20} />
                            <span>St.John, USVI</span>
                        </div>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="contact-form"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="submit-button"
                    >
                        <Send size={18} />
                        Send Message
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default Contact;