"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  perspective?: number;
  intensity?: number;
  glareIntensity?: number;
  glare?: boolean;
  shadow?: boolean;
  disabled?: boolean;
  borderRadius?: string;
  glowColor?: string;
}

export default function FloatingCard({
  children,
  className = "",
  perspective = 1000,
  intensity = 15,
  glareIntensity = 0.4,
  glare = true,
  shadow = true,
  disabled = false,
  borderRadius = "1rem",
  glowColor = "#D0BEA0",
}: FloatingCardProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate rotation and glare effect based on mouse position
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || disabled) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation angle
      const rotateX = ((y - centerY) / centerY) * (intensity * -1);
      const rotateY = ((x - centerX) / centerX) * intensity;

      // Apply card transform
      setStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      });

      if (glare) {
        // Calculate glare positioning and opacity based on mouse position
        const glareX = ((x / rect.width) * 100).toFixed(2);
        const glareY = ((y / rect.height) * 100).toFixed(2);

        setGlareStyle({
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareIntensity}), transparent 70%)`,
        });
      }
    },
    [perspective, intensity, glareIntensity, disabled, glare]
  );

  // Reset card to initial position when mouse leaves
  const handleMouseLeave = useCallback(() => {
    if (disabled) return;

    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.5s ease-out",
    });

    if (glare) {
      setGlareStyle({
        background: "transparent",
      });
    }
  }, [disabled, glare]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative transition-all ${className}`}
      style={{
        borderRadius,
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: shadow
          ? `0 10px 30px -10px ${glowColor}50, 0 5px 10px rgba(0,0,0,0.1)`
          : "none",
      }}
      transition={{ duration: 0.5 }}
      whileHover={
        disabled
          ? {}
          : {
              boxShadow: shadow
                ? `0 20px 40px -20px ${glowColor}80, 0 10px 20px rgba(0,0,0,0.1)`
                : "none",
            }
      }
    >
      {/* Content */}
      {children}

      {/* Glare effect */}
      {glare && !disabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius,
            ...glareStyle,
          }}
        />
      )}
    </motion.div>
  );
}
