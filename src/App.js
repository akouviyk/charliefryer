import './App.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Upload, Edit3, Save, Trash2, Move, Grid, Image, Lock, Unlock, Camera, Sparkles, Palette, Zap } from 'lucide-react';
import './PhotographyPortfolio.css';
import PhotoItem from './PhotoItem'
// Enhanced mock data with more variety
const initialPhotos = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: 'Mountain Majesty', width: 400, height: 600, x: 0, y: 0, category: 'landscape' },
  { id: '2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80', title: 'Mystic Forest', width: 500, height: 350, x: 1, y: 0, category: 'nature' },
  { id: '3', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&q=80', title: 'Desert Dreams', width: 350, height: 500, x: 2, y: 0, category: 'landscape' },
  { id: '4', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', title: 'Ocean Symphony', width: 600, height: 400, x: 0, y: 1, category: 'seascape' },
  { id: '5', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80', title: 'Ethereal Mist', width: 450, height: 600, x: 1, y: 1, category: 'nature' },
  { id: '6', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', title: 'Alpine Glow', width: 400, height: 300, x: 2, y: 1, category: 'landscape' },
  { id: '7', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', title: 'Sunset Peak', width: 500, height: 700, x: 0, y: 2, category: 'landscape' },
  { id: '8', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80', title: 'Urban Nights', width: 600, height: 400, x: 1, y: 2, category: 'urban' },
];

const categories = ['all', 'landscape', 'nature', 'seascape', 'urban'];

const App = () => {
  const [photos, setPhotos] = useState(initialPhotos);
  const [filteredPhotos, setFilteredPhotos] = useState(initialPhotos);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [draggedPhoto, setDraggedPhoto] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [gridCols, setGridCols] = useState(3);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.3], [0, 2]);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading simulation
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Filter photos by category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter(photo => photo.category === activeCategory));
    }
  }, [photos, activeCategory]);

  const handleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
    if (isAuthenticated) {
      setIsEditMode(false);
    }
  };

  const saveLayout = useCallback(() => {
    localStorage.setItem('photoLayout', JSON.stringify(photos));
    console.log('Layout saved!');
  }, [photos]);

  useEffect(() => {
    const savedLayout = localStorage.getItem('photoLayout');
    if (savedLayout) {
      setPhotos(JSON.parse(savedLayout));
    }
  }, []);

  const handleDragStart = (e, photo) => {
    if (!isEditMode) return;
    setDraggedPhoto(photo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPhoto) => {
    if (!isEditMode || !draggedPhoto) return;
    e.preventDefault();

    const draggedIndex = photos.findIndex(p => p.id === draggedPhoto.id);
    const targetIndex = photos.findIndex(p => p.id === targetPhoto.id);

    if (draggedIndex === targetIndex) return;

    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(targetIndex, 0, removed);

    setPhotos(newPhotos);
    setDraggedPhoto(null);
  };

  const deletePhoto = (photoId) => {
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  const addPhoto = () => {
    const categories = ['landscape', 'nature', 'seascape', 'urban'];
    const newPhoto = {
      id: Date.now().toString(),
      url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000)}?w=600&q=80`,
      title: 'New Masterpiece',
      width: 400 + Math.floor(Math.random() * 200),
      height: 300 + Math.floor(Math.random() * 300),
      x: Math.floor(Math.random() * gridCols),
      y: Math.floor(photos.length / gridCols),
      category: categories[Math.floor(Math.random() * categories.length)],
    };
    setPhotos([...photos, newPhoto]);
  };

  // Loading screen
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="loading-screen"
      >
        <div className="loading-content">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="loading-icon"
          >
            <div className="loading-icon-inner"></div>
            <Camera className="camera-icon" size={48} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="loading-title"
          >
            Loading Portfolio
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="loading-bar"
          />
        </div>
      </motion.div>
    );
  }

  // const PhotoItem = ({ photo, index }) => {
  //   const ref = useRef(null);
  //   const isInView = useInView(ref, { once: true, margin: "-100px" });

  //   return (
  //     <motion.div
  //       ref={ref}
  //       layout
  //       initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
  //       animate={isInView ? {
  //         opacity: 1,
  //         scale: 1,
  //         rotateY: 0,
  //         transition: {
  //           duration: 0.6,
  //           delay: index * 0.1,
  //           ease: "easeOut"
  //         }
  //       } : {}}
  //       exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
  //       whileHover={{
  //         scale: isEditMode ? 1 : 1.05,
  //         rotateX: 5,
  //         z: 50,
  //         transition: { duration: 0.3 }
  //       }}
  //       className={`photo-item ${isEditMode ? 'edit-mode' : ''}`}
  //       style={{
  //         background: `linear-gradient(135deg, rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, 0.1) 0%, transparent 100%)`,
  //       }}
  //       draggable={isEditMode}
  //       onDragStart={(e) => handleDragStart(e, photo)}
  //       onDragOver={handleDragOver}
  //       onDrop={(e) => handleDrop(e, photo)}
  //       onClick={() => !isEditMode && setSelectedPhoto(photo)}
  //     >
  //       {/* Animated border */}
  //       <motion.div
  //         className="photo-border"
  //         animate={{
  //           background: [
  //             'linear-gradient(45deg, transparent, transparent)',
  //             'linear-gradient(45deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))',
  //             'linear-gradient(45deg, transparent, transparent)',
  //           ]
  //         }}
  //         transition={{ duration: 3, repeat: Infinity }}
  //       />

  //       <div className="photo-image-container">
  //         <motion.img
  //           src={photo.url}
  //           alt={photo.title}
  //           className="photo-image"
  //           style={{
  //             aspectRatio: `${photo.width}/${photo.height}`,
  //             filter: `hue-rotate(${index * 15}deg)`,
  //           }}
  //           whileHover={{ scale: 1.1 }}
  //           transition={{ duration: 0.5 }}
  //         />

  //         {/* Gradient overlay */}
  //         <motion.div
  //           className="photo-overlay"
  //         />

  //         {/* Sparkle effects */}
  //         <motion.div
  //           className="photo-sparkle"
  //           initial={false}
  //           whileHover={{
  //             background: [
  //               'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
  //               'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)',
  //               'radial-gradient(circle at 40% 60%, rgba(255,255,255,0.3) 0%, transparent 50%)',
  //             ]
  //           }}
  //           transition={{ duration: 2, repeat: Infinity }}
  //         />
  //       </div>

  //       {/* Content overlay */}
  //       <motion.div
  //         className="photo-content"
  //         initial={{ opacity: 0 }}
  //         whileHover={{ opacity: 1 }}
  //         transition={{ duration: 0.3 }}
  //       >
  //         {/* Category badge */}
  //         <div className="category-badge">
  //           <motion.span
  //             initial={{ scale: 0, rotate: -10 }}
  //             whileHover={{ scale: 1, rotate: 0 }}
  //             transition={{ delay: 0.1 }}
  //             className="category-text"
  //           >
  //             {photo.category}
  //           </motion.span>
  //         </div>

  //         {/* Title and controls */}
  //         <div className="photo-controls">
  //           {!isEditMode ? (
  //             <motion.div
  //               initial={{ y: 20, opacity: 0 }}
  //               whileHover={{ y: 0, opacity: 1 }}
  //               transition={{ delay: 0.2 }}
  //             >
  //               <h3 className="photo-title">
  //                 {photo.title}
  //               </h3>
  //               <div className="photo-caption">
  //                 <Sparkles size={14} />
  //                 <span>Captured with passion</span>
  //               </div>
  //             </motion.div>
  //           ) : (
  //             <motion.div
  //               initial={{ scale: 0 }}
  //               animate={{ scale: 1 }}
  //               className="edit-controls"
  //             >
  //               <motion.button
  //                 whileHover={{ scale: 1.2, rotate: 5 }}
  //                 whileTap={{ scale: 0.9 }}
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   deletePhoto(photo.id);
  //                 }}
  //                 className="control-button delete-button"
  //               >
  //                 <Trash2 size={18} />
  //               </motion.button>
  //               <motion.div
  //                 whileHover={{ scale: 1.2, rotate: -5 }}
  //                 className="control-button move-button"
  //               >
  //                 <Move size={18} />
  //               </motion.div>
  //             </motion.div>
  //           )}
  //         </div>
  //       </motion.div>

  //       {/* Floating elements */}
  //       <motion.div
  //         className="floating-icon"
  //         animate={{
  //           y: [0, -5, 0],
  //           rotate: [0, 5, 0],
  //         }}
  //         transition={{
  //           duration: 2,
  //           repeat: Infinity,
  //           ease: "easeInOut"
  //         }}
  //       >
  //         <Zap className="zap-icon" size={16} />
  //       </motion.div>
  //     </motion.div>
  //   );
  // };

  return (
    <div className="portfolio-container">
      {/* Animated background elements */}
      <div className="background-elements">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="bg-element-1"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="bg-element-2"
        />
      </div>

      {/* Hero Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="portfolio-header"
      >
        <motion.div
          style={{
            scale: heroScale,
            filter: `blur(${heroBlur}px)`,
          }}
          className="header-background"
        />

        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="header-title-section"
          >
            <motion.div
              animate={{
                rotateY: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="header-icon"
            >
              <Camera className="camera-icon-header" size={64} />
            </motion.div>

            <h1 className="main-title">
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="title-gradient"
              >
                CHARLIE M.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="header-subtitle"
            >
              Capturing the extraordinary in the ordinary • Visual storytelling through lens and light
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 1, duration: 1.5 }}
              className="header-divider"
            />
          </motion.div>

          {/* Admin Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="admin-controls"
          >
            <div className="controls-container">
              {!isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAuth}
                  className="auth-button login-button"
                >
                  <Lock size={18} />
                  <span className="button-text">Admin Access</span>
                </motion.button>
              ) : (
                <div className="auth-controls">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`edit-toggle ${isEditMode ? 'edit-active' : ''}`}
                  >
                    <Edit3 size={16} />
                    <span>{isEditMode ? 'Exit Edit' : 'Edit Mode'}</span>
                  </motion.button>

                  {isEditMode && (
                    <>
                      <motion.button
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addPhoto}
                        className="action-button add-button"
                      >
                        <Upload size={16} />
                        <span>Add Photo</span>
                      </motion.button>

                      <motion.button
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveLayout}
                        className="action-button save-button"
                      >
                        <Save size={16} />
                        <span>Save Layout</span>
                      </motion.button>
                    </>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAuth}
                    className="auth-button logout-button"
                  >
                    <Unlock size={16} />
                    <span>Logout</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="category-filter"
      >
        <div className="filter-container">
          <div className="filter-buttons">
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`filter-button ${activeCategory === category ? 'filter-active' : ''}`}
              >
                <span className="capitalize">{category}</span>
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="active-indicator"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Grid Controls */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid-controls"
        >
          <div className="grid-controls-container">
            <div className="grid-controls-content">
              <div className="grid-label">
                <Palette className="palette-icon" size={20} />
                <span className="grid-text">Grid Layout:</span>
              </div>
              <div className="grid-buttons">
                {[2, 3, 4, 5].map(cols => (
                  <motion.button
                    key={cols}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setGridCols(cols)}
                    className={`grid-button ${gridCols === cols ? 'grid-active' : ''}`}
                  >
                    {cols}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Photo Grid */}
      <main className="portfolio-main">
        <motion.div
          layout
          className={`photo-grid grid-${gridCols}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <PhotoItem key={photo.id} photo={photo} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="empty-icon"
            >
              <Image size={80} className="image-icon" />
            </motion.div>
            <h3 className="empty-title">No photos in this category</h3>
            {isEditMode && (
              <p className="empty-subtitle">Click "Add Photo" to get started</p>
            )}
          </motion.div>
        )}
      </main>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="photo-modal"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content */}
              <div className="modal-image-container">
                <motion.img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="modal-image"
                  layoutId={`photo-${selectedPhoto.id}`}
                />

                {/* Floating close button */}
                <motion.button
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 90,
                    boxShadow: "0 0 30px rgba(255,255,255,0.5)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPhoto(null)}
                  className="modal-close"
                >
                  ✕
                </motion.button>

                {/* Photo info overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="modal-info"
                >
                  <div className="modal-info-content">
                    <div>
                      <motion.h3
                        className="modal-title"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {selectedPhoto.title}
                      </motion.h3>
                      <div className="modal-tags">
                        <span className="modal-category">
                          {selectedPhoto.category}
                        </span>
                        <div className="modal-caption">
                          <Camera size={16} />
                          <span className="caption-text">Professional Photography</span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="modal-sparkle"
                    >
                      <Sparkles size={24} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Ambient glow effect */}
              <motion.div
                className="modal-glow"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            className="floating-edit-indicator"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                boxShadow: [
                  "0 10px 30px rgba(59, 130, 246, 0.3)",
                  "0 20px 40px rgba(59, 130, 246, 0.5)",
                  "0 10px 30px rgba(59, 130, 246, 0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="edit-indicator-content"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Grid size={20} />
              </motion.div>
              <span className="indicator-text">Edit Mode Active</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: scrollYProgress.get() > 0.2 ? 1 : 0,
          scale: scrollYProgress.get() > 0.2 ? 1 : 0,
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="scroll-top-button"
      >
        ↑
      </motion.button>

      {/* Background particles */}
      <div className="particles-container">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
