
import './PhotographyPortfolio.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Upload, Edit3, Save, Trash2, Move, Grid, Image, Lock, Unlock, Camera, Sparkles, Palette, Zap } from 'lucide-react';
import { db } from './firebase'
import PhotoItem from './PhotoItem'
import { collection, deleteDoc, addDoc, query, orderBy, doc, startAfter, onSnapshot, updateDoc } from 'firebase/firestore';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
});

const categories = ['all', 'landscape', 'nature', 'seascape', 'urban'];

const Portfolio = () => {
    const [photos, setPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);
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
    // ... (other state and ref declarations remain the same)
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

    // Filter photos by category
    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredPhotos(photos);
        } else {
            setFilteredPhotos(photos.filter(photo => photo.category === activeCategory));
        }
    }, [photos, activeCategory]);

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const photosData = [];
                    querySnapshot.forEach((doc) => {
                        photosData.push({ id: doc.id, ...doc.data() });
                    });
                    setPhotos(photosData);
                    setIsLoading(false);
                });
                return unsubscribe;
            } catch (error) {
                console.error('Error loading photos:', error);
                setIsLoading(false);
            }
        };

        loadPhotos();
    }, []);

    const handleAuth = () => {
        setIsAuthenticated(!isAuthenticated);
        if (isAuthenticated) {
            setIsEditMode(false);
        }
    };

    const saveLayout = useCallback(async () => {
        try {
            setIsLoading(true);
            const updates = photos.map(photo =>
                updateDoc(doc(db, 'photos', photo.id), {
                    x: photo.x,
                    y: photo.y
                })
            );
            await Promise.all(updates);
            console.log('Layout saved to database!');
        } catch (error) {
            console.error('Error saving layout:', error);
        } finally {
            setIsLoading(false);
        }
    }, [photos]);

    const handleDragStart = (e, photo) => {
        if (!isEditMode) return;
        setDraggedPhoto(photo);
        e.dataTransfer.effectAllowed = 'move';
    };
    // Fixed addPhoto function
    const addPhoto = async (file) => {
        try {
            setIsLoading(true);

            const fileName = `photos/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

            // Convert file to ArrayBuffer first, then to Uint8Array
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const uploadParams = {
                Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
                Key: fileName,
                Body: uint8Array,
                ContentType: file.type,
            };

            console.log('Uploading to S3...', uploadParams);

            await s3Client.send(new PutObjectCommand(uploadParams));

            const s3Url = `https://${process.env.REACT_APP_AWS_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${fileName}`;

            console.log('S3 URL:', s3Url);

            // Get image dimensions
            const dimensions = await getImageDimensions(file);

            const newPhoto = {
                url: s3Url,
                title: file.name.split('.')[0] || 'New Masterpiece',
                width: dimensions.width,
                height: dimensions.height,
                x: Math.floor(Math.random() * gridCols),
                y: Math.floor(photos.length / gridCols),
                category: 'landscape',
                createdAt: new Date(),
                fileName: file.name,
                s3Key: fileName,
            };

            console.log('Adding to Firestore:', newPhoto);
            await addDoc(collection(db, 'photos'), newPhoto);

            console.log('Photo added successfully!');

        } catch (error) {
            console.error('Error adding photo:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            alert('Error uploading photo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get image dimensions
    // Replace the getImageDimensions function with:
    const getImageDimensions = (file) => {
        return new Promise((resolve) => {
            const img = new window.Image(); // Use window.Image explicitly
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
                URL.revokeObjectURL(objectUrl);
            };

            img.src = objectUrl;
        });
    };

    // Alternative approach using fetch API if the above doesn't work
    const addPhotoAlternative = async (file) => {
        try {
            setIsLoading(true);

            const fileName = `photos/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

            // Use fetch to upload to S3 via a presigned URL or your backend
            // This approach requires a backend endpoint that handles S3 uploads
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('fileName', fileName);

            const response = await fetch('/api/upload-photo', { // You'll need to create this endpoint
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const { s3Url } = await response.json();

            const dimensions = await getImageDimensions(file);

            const newPhoto = {
                url: s3Url,
                title: file.name.split('.')[0] || 'New Masterpiece',
                width: dimensions.width,
                height: dimensions.height,
                x: Math.floor(Math.random() * gridCols),
                y: Math.floor(photos.length / gridCols),
                category: 'landscape',
                createdAt: new Date(),
                fileName: file.name,
                s3Key: fileName,
            };

            await addDoc(collection(db, 'photos'), newPhoto);

        } catch (error) {
            console.error('Error adding photo:', error);
            alert('Error uploading photo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Simple approach using FileReader (alternative method)
    const addPhotoSimple = async (file) => {
        try {
            setIsLoading(true);

            const fileName = `photos/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

            // Convert file to base64 first, then to buffer
            const fileBuffer = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            const uploadParams = {
                Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
                Key: fileName,
                Body: fileBuffer,
                ContentType: file.type,
            };

            await s3Client.send(new PutObjectCommand(uploadParams));

            const s3Url = `https://${process.env.REACT_APP_AWS_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${fileName}`;

            const dimensions = await getImageDimensions(file);

            const newPhoto = {
                url: s3Url,
                title: file.name.split('.')[0] || 'New Masterpiece',
                width: dimensions.width,
                height: dimensions.height,
                x: Math.floor(Math.random() * gridCols),
                y: Math.floor(photos.length / gridCols),
                category: 'landscape',
                createdAt: new Date(),
                fileName: file.name,
                s3Key: fileName,
            };

            await addDoc(collection(db, 'photos'), newPhoto);

        } catch (error) {
            console.error('Error adding photo:', error);
            alert('Error uploading photo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Delete photo from both Storage and Firestore
    const deletePhoto = async (photoId, s3Key) => {
        try {
            setIsLoading(true);

            // Delete from S3
            if (s3Key) {
                const deleteParams = {
                    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
                    Key: s3Key,
                };
                await s3Client.send(new DeleteObjectCommand(deleteParams));
            }

            // Delete from Firestore
            await deleteDoc(doc(db, 'photos', photoId));

        } catch (error) {
            console.error('Error deleting photo:', error);
            alert('Error deleting photo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Update photo data in Firestore
    const updatePhoto = async (photoId, updates) => {
        try {
            const photoRef = doc(db, 'photos', photoId);
            await updateDoc(photoRef, updates);
        } catch (error) {
            console.error('Error updating photo:', error);
        }
    };

    // Enhanced addPhoto function with file input
    const handleAddPhoto = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Try the main function first, fall back to simple if needed
                addPhoto(file).catch(error => {
                    console.error('Main upload failed, trying alternative:', error);
                    addPhotoSimple(file);
                });
            }
        };
        input.click();
    };

    // Enhanced delete function
    const handleDeletePhoto = (photo) => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            deletePhoto(photo.id, photo.s3Key || photo.fileName);
        }
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

        // Update positions for grid layout
        const updatedPhotos = newPhotos.map((photo, index) => ({
            ...photo,
            x: index % gridCols,
            y: Math.floor(index / gridCols)
        }));

        setPhotos(updatedPhotos);
        setDraggedPhoto(null);
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
                                CHARLEY MARIE.
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
                                                onClick={handleAddPhoto}
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
                                onClick={() => {
                                    setActiveCategory(category);
                                }}
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
                            <PhotoItem
                                key={photo.id}
                                photo={photo}
                                index={index}
                                onDelete={handleDeletePhoto}
                                onUpdate={updatePhoto}
                                isEditMode={isEditMode}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                setSelectedPhoto={setSelectedPhoto}
                            />
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

export default Portfolio;