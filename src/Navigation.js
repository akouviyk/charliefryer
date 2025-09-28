// Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, User, Mail } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Portfolio', icon: Camera },
        { path: '/about', label: 'About', icon: User },
        { path: '/contact', label: 'Contact', icon: Mail },
    ];

    return (
        <motion.nav
            className="portfolio-nav"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="nav-container">
                <motion.div
                    className="nav-logo"
                    whileHover={{ scale: 1.05 }}
                >
                    <Link to="/">
                        <Camera size={24} />
                        <span>CHARLEY MARIE</span>
                    </Link>
                </motion.div>

                <div className="nav-links">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <motion.div
                                key={item.path}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                            >
                                <Link
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'nav-active' : ''}`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="nav-indicator"
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navigation;