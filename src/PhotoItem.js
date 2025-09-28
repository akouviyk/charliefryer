import React, { useRef, useMemo } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import { Trash2, Move, Sparkles, Zap } from "lucide-react";

const PhotoItem = ({ photo, setSelectedPhoto, deletePhoto, handleDragStart, handleDragOver, handleDrop, index, onDelete, onUpdate, isEditMode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Motion values for parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
            mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Memoized gradient background (no reruns on every render)
    const backgroundGradient = useMemo(
        () =>
            `linear-gradient(135deg,
        rgba(${Math.floor(Math.random() * 100 + 100)},
             ${Math.floor(Math.random() * 100 + 100)},
             ${Math.floor(Math.random() * 100 + 150)}, 0.1) 0%,
        transparent 100%)`,
        []
    );
    // Add delete handler
    const handleDelete = () => {
        onDelete(photo);
    };

    // Add update handler for any changes
    const handleUpdate = (updates) => {
        onUpdate(photo.id, updates);
    };



    return (
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={
                isInView
                    ? {
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        transition: {
                            duration: 0.6,
                            delay: index * 0.1,
                            ease: "easeOut",
                        },
                    }
                    : {}
            }
            exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            whileHover={{
                scale: isEditMode ? 1 : 1.05,
                rotateX: 5,
                z: 50,
                transition: { duration: 0.3 },
            }}
            className={`photo-item ${isEditMode ? "edit-mode" : ""}`}
            style={{
                background: backgroundGradient,
                x: mouseX,
                y: mouseY, // smooth parallax without re-render
            }}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, photo)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, photo)}
            onClick={() => !isEditMode && setSelectedPhoto(photo)}
        >
            {/* Animated border */}
            <motion.div
                className="photo-border"
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="photo-image-container">
                <motion.img
                    src={photo.url}
                    alt={photo.title}
                    className="photo-image"
                    style={{
                        aspectRatio: `${photo.width}/${photo.height}`,
                        filter: `hue-rotate(${index * 15}deg)`,
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Overlay */}
                <motion.div className="photo-overlay" />

                {/* Sparkle effect */}
                <motion.div
                    className="photo-sparkle"
                    whileHover={{
                        background:
                            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    }}
                    transition={{ duration: 2 }}
                />
            </div>

            {/* Content overlay */}
            <motion.div
                className="photo-content"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="category-badge">
                    <motion.span
                        initial={{ scale: 0, rotate: -10 }}
                        whileHover={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1 }}
                        className="category-text"
                    >
                        {photo.category}
                    </motion.span>
                </div>

                <div className="photo-controls">
                    {!isEditMode ? (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="photo-title">{photo.title}</h3>
                            <div className="photo-caption">
                                <Sparkles size={14} />
                                <span>Captured with passion</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="edit-controls"
                        >
                            <motion.button
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePhoto(photo.id);
                                    // handleDelete
                                }}
                                className="control-button delete-button"
                            >
                                <Trash2 size={18} />
                            </motion.button>
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: -5 }}
                                className="control-button move-button"
                            >
                                <Move size={18} />
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </motion.div>



            {/* Floating icon */}
            <motion.div
                className="floating-icon"
                animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Zap className="zap-icon" size={16} />
            </motion.div>
        </motion.div>
    );
};

export default PhotoItem;


// PhotoItem.js
// import React from 'react';
// import { motion } from 'framer-motion';
// import { Edit3, Trash2, Move } from 'lucide-react';

// const PhotoItem = ({
//     photo,
//     index,
//     onDelete,
//     onUpdate,
//     isEditMode,
//     onDragStart,
//     onDragOver,
//     onDrop
// }) => {
//     const handleDragStart = (e) => {
//         onDragStart(e, photo);
//     };

//     const handleDragOver = (e) => {
//         onDragOver(e);
//     };

//     const handleDrop = (e) => {
//         onDrop(e, photo);
//     };

//     return (
//         <motion.div
//             layout
//             initial={{ opacity: 0, scale: 0.8, y: 50 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.8, y: -50 }}
//             transition={{
//                 type: "spring",
//                 damping: 20,
//                 stiffness: 300,
//                 delay: index * 0.1,
//             }}
//             className={`photo-item ${isEditMode ? 'edit-mode' : ''}`}
//             draggable={isEditMode}
//             onDragStart={handleDragStart}
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//             whileHover={{
//                 scale: isEditMode ? 1.02 : 1.05,
//                 zIndex: 10
//             }}
//         >
//             <div className="photo-content">
//                 <motion.img
//                     src={photo.url}
//                     alt={photo.title}
//                     className="photo-image"
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ duration: 0.3 }}
//                 />

//                 {/* Edit mode overlay */}
//                 {isEditMode && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="edit-overlay"
//                     >
//                         <div className="edit-controls">
//                             <motion.button
//                                 whileHover={{ scale: 1.1, rotate: 5 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 className="edit-button move-button"
//                                 title="Drag to reorder"
//                             >
//                                 <Move size={16} />
//                             </motion.button>

//                             <motion.button
//                                 whileHover={{ scale: 1.1, rotate: -5 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 className="edit-button delete-button"
//                                 onClick={() => onDelete(photo)}
//                                 title="Delete photo"
//                             >
//                                 <Trash2 size={16} />
//                             </motion.button>
//                         </div>
//                     </motion.div>
//                 )}

//                 {/* Photo info */}
//                 <div className="photo-info">
//                     <h3 className="photo-title">{photo.title}</h3>
//                     <span className="photo-category">{photo.category}</span>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default PhotoItem;