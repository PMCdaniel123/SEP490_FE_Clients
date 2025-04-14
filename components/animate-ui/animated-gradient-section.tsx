"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedGradientSectionProps {
  children: React.ReactNode;
  className?: string;
  gradient?: "warm" | "cool" | "neutral" | "custom";
  customColors?: string[];
  height?: string;
  width?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full" | "none";
  interactive?: boolean;
  animationSpeed?: "slow" | "medium" | "fast";
  hoverEffect?: boolean;
}

export default function AnimatedGradientSection({
  children,
  className = "",
  gradient = "warm",
  customColors,
  height = "auto",
  width = "100%",
  rounded = "lg",
  interactive = true,
  animationSpeed = "medium",
  hoverEffect = true,
}: AnimatedGradientSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

  // Define gradient colors based on selected theme
  const getGradientColors = () => {
    if (customColors && customColors.length >= 2) return customColors;

    switch (gradient) {
      case "warm":
        return ["#D0BEA0", "#835101", "#bb8e55", "#6f3b13"];
      case "cool":
        return ["#a9c1d9", "#3a6ea5", "#6f96c8", "#1d3557"];
      case "neutral":
        return ["#e0e0e0", "#6c757d", "#adb5bd", "#343a40"];
      default:
        return ["#D0BEA0", "#835101", "#bb8e55", "#6f3b13"];
    }
  };

  // Define animation duration based on selected speed
  const getDuration = () => {
    switch (animationSpeed) {
      case "slow":
        return 20;
      case "medium":
        return 12;
      case "fast":
        return 6;
      default:
        return 12;
    }
  };

  // Define border radius based on selected roundness
  const getBorderRadius = () => {
    switch (rounded) {
      case "sm":
        return "0.25rem";
      case "md":
        return "0.5rem";
      case "lg":
        return "1rem";
      case "xl":
        return "1.5rem";
      case "full":
        return "9999px";
      case "none":
        return "0";
      default:
        return "1rem";
    }
  };

  // Update mouse position for interactive effect
  useEffect(() => {
    if (!interactive || !elementRef) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = elementRef.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const updateDimensions = () => {
      if (elementRef) {
        setDimensions({
          width: elementRef.offsetWidth,
          height: elementRef.offsetHeight,
        });
      }
    };

    elementRef.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", updateDimensions);

    // Initialize dimensions
    updateDimensions();

    return () => {
      if (elementRef) {
        elementRef.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("resize", updateDimensions);
    };
  }, [elementRef, interactive]);

  return (
    <div
      ref={setElementRef}
      style={{
        width,
        height,
        borderRadius: getBorderRadius(),
        overflow: "hidden",
        position: "relative",
      }}
      className={`relative ${className}`}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at ${
            interactive
              ? `${(mousePosition.x / dimensions.width) * 100}% ${
                  (mousePosition.y / dimensions.height) * 100
                }%`
              : "50% 50%"
          }, ${getGradientColors()[0]} 0%, ${getGradientColors()[1]} 25%, ${
            getGradientColors()[2]
          } 50%, ${getGradientColors()[3]} 100%)`,
        }}
        animate={
          !interactive
            ? {
                backgroundPosition: [
                  "0% 0%",
                  "100% 0%",
                  "100% 100%",
                  "0% 100%",
                  "0% 0%",
                ],
              }
            : {}
        }
        transition={
          !interactive
            ? {
                duration: getDuration(),
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
            : {}
        }
      />

      {/* Subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      {/* Content container */}
      <motion.div
        className="relative z-10 w-full h-full"
        whileHover={
          hoverEffect
            ? {
                scale: 1.01,
                transition: { duration: 0.3 },
              }
            : {}
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
