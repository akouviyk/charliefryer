// // Navigation.js
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Camera, User, Mail } from 'lucide-react';

// const Navigation = () => {
//     const location = useLocation();

//     const navItems = [
//         { path: '/', label: 'Portfolio', icon: Camera },
//         { path: '/services', label: 'Services', icon: Mail },
//         { path: '/about', label: 'About', icon: User },
//         { path: '/contact', label: 'Contact', icon: Mail },

//     ];

//     return (
//         <motion.nav
//             className="portfolio-nav"
//             initial={{ y: -100 }}
//             animate={{ y: 0 }}
//             transition={{ duration: 0.6 }}
//         >
//             <div className="nav-container">
//                 <motion.div
//                     className="nav-logo"
//                     whileHover={{ scale: 1.05 }}
//                 >
//                     <Link to="/">
//                         <Camera size={24} />
//                         <span>ISP</span>
//                     </Link>
//                 </motion.div>

//                 <div className="nav-links">
//                     {navItems.map((item) => {
//                         const Icon = item.icon;
//                         const isActive = location.pathname === item.path;

//                         return (
//                             <motion.div
//                                 key={item.path}
//                                 whileHover={{ y: -2 }}
//                                 whileTap={{ y: 0 }}
//                             >
//                                 <Link
//                                     to={item.path}
//                                     className={`nav-link ${isActive ? 'nav-active' : ''}`}
//                                 >
//                                     <Icon size={18} />
//                                     <span>{item.label}</span>
//                                     {isActive && (
//                                         <motion.div
//                                             layoutId="navIndicator"
//                                             className="nav-indicator"
//                                         />
//                                     )}
//                                 </Link>
//                             </motion.div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </motion.nav>
//     );
// };

// export default Navigation;



// Navigation.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, User, Mail, Menu, X } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Portfolio', icon: Camera },
        { path: '/services', label: 'Services', icon: Mail },
        { path: '/about', label: 'About', icon: User },
        { path: '/contact', label: 'Contact', icon: Mail },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

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
                        <span>ISP</span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="nav-links desktop-nav">
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

                {/* Mobile Menu Button */}
                <motion.button
                    className="mobile-menu-button"
                    onClick={toggleMobileMenu}
                    whileTap={{ scale: 0.95 }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="mobile-nav-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                        >
                            <motion.div
                                className="mobile-nav-menu"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mobile-nav-header">
                                    <div className="nav-logo">
                                        <Camera size={24} />
                                        <span>ISP</span>
                                    </div>
                                    <button
                                        className="mobile-close-button"
                                        onClick={closeMobileMenu}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="mobile-nav-links">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path;

                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`mobile-nav-link ${isActive ? 'mobile-nav-active' : ''}`}
                                                onClick={closeMobileMenu}
                                            >
                                                <Icon size={20} />
                                                <span>{item.label}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="mobileNavIndicator"
                                                        className="mobile-nav-indicator"
                                                    />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navigation;