import React, { useState } from 'react';
import { motion } from 'framer-motion';

import '../styles/cards.scss';
import { Link } from 'react-router-dom';

interface Theme {
    backgroundColor?: string;
    textBackground?: string;
    borderColor?: string;
    starColor?: string;
    headerColor?: string;
    lightColorHeader?: string,
    // …any other style values you need
  }
  
  interface GradientCardProps {
    title: string;
    label: string;
    onClick: () => void;
    theme?: Theme;
    image?:string;
    link:string;
  }

  
const GradientCard = ({ title, label, onClick,theme = {}, image, link  }:GradientCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    // const mergedTheme = {
    //     backgroundColor: theme.backgroundColor || "#070707",
    //     borderColor: theme.borderColor || "1px solid #333",
    //     starColor: theme.starColor || "rgba(211, 211, 84, 0.7)",
    //     headerColor: theme.headerColor || "#F9F9E2",
    //     // add more default values as needed
    //   };
    
    // Generate stars with optimized properties
    const stars = React.useMemo(() => {
      return [...Array(15)].map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
        // Randomize movement amount but keep it small for performance
        moveX: (Math.random() - 0.5) * 30,
        moveY: (Math.random() - 0.5) * 30,
        // Different transition durations for variety
        duration: 2 + Math.random() * 3
      }));
    }, []);


  return (
    <motion.div className="gradient-card" onClick={onClick} onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    style={{
        '--card-bg': theme.backgroundColor,
        '--text-bg':theme.textBackground,
        '--card-border': theme.borderColor,
        '--star-color': theme.starColor,
        '--header-color': theme.headerColor,
        '--light-color': theme.lightColorHeader,
      } as React.CSSProperties}
    >
      <Link to={link} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="gradient-card__grid"></div>
        <div className="gradient-card__stars">
        {stars.map((star) => (
          <motion.div 
            key={star.id}
            className="gradient-card__star"
            
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
            }}
            animate={isHovered ? {
              x: star.moveX,
              y: star.moveY,
              opacity: [star.opacity, star.opacity * 1.5, star.opacity],
            } : {
              x: 0,
              y: 0,
            }}
            transition={{
              duration: star.duration,
              ease: "easeInOut",
              // Only animate when needed for better performance
              x: { type: "spring", stiffness: 100, damping: 10 },
              y: { type: "spring", stiffness: 100, damping: 10 },
              opacity: { repeat: Infinity, repeatType: "reverse" }
            }}
          />
        ))}
      </div>
      <div className="gradient-card__content">
        <div className="gradient-card__header">
          <div className="gradient-card__recently">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Recently
          </div>
        </div>
        <div className="gradient-card__bottom">
        {label && (
          <div className="gradient-card__label">
            {label}
          </div>
        )}
        <h2 className="gradient-card__title">{title}</h2>
        {image && (
            <div className="gradient-card__image">
              <img src={image} alt={title} />
            </div>
          )}
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

export default GradientCard;