// Contact.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            // Replace with your EmailJS service ID, template ID, and public key
            const result = await emailjs.send(
                'YOUR_SERVICE_ID', // Create this in EmailJS dashboard
                'YOUR_TEMPLATE_ID', // Create this in EmailJS dashboard
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: 'IslandSoulPhotography@gmail.com',
                    reply_to: formData.email
                },
                'YOUR_PUBLIC_KEY' // Get this from EmailJS dashboard
            );

            if (result.text === 'OK') {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
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
                    className="contact-title"
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
                            <div className="contact-icon">
                                <Mail size={20} />
                            </div>
                            <div className="contact-detail-content">
                                <h3>Email</h3>
                                <p>IslandSoulPhotography@gmail.com</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon">
                                <Phone size={20} />
                            </div>
                            <div className="contact-detail-content">
                                <h3>Phone</h3>
                                <p>+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon">
                                <MapPin size={20} />
                            </div>
                            <div className="contact-detail-content">
                                <h3>Location</h3>
                                <p>St. John, USVI</p>
                            </div>
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
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Tell me about your project or inquiry..."
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="status-message success"
                        >
                            Thank you! Your message has been sent successfully.
                        </motion.div>
                    )}

                    {submitStatus === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="status-message error"
                        >
                            Sorry, there was an error sending your message. Please try again.
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="loading-spinner"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Send Message
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default Contact;