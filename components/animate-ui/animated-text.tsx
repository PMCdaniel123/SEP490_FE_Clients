"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  animation?: "wave" | "typewriter" | "fade" | "highlight";
  delay?: number;
  duration?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  repeated?: boolean;
  highlightColor?: string;
  onAnimationComplete?: () => void;
}

export default function AnimatedText({
  text,
  className = "",
  animation = "wave",
  delay = 0,
  duration = 0.05,
  tag = "div",
  repeated = false,
  highlightColor = "#835101",
  onAnimationComplete,
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    // For visibility detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (repeated) {
          setIsVisible(false);
          // Small delay before allowing replay
          setTimeout(() => {
            setReplay((prev) => prev + 1);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    const elementRef = document.getElementById(
      `animated-text-${text.slice(0, 10).replace(/\s/g, "-")}`
    );
    if (elementRef) observer.observe(elementRef);

    return () => {
      if (elementRef) observer.unobserve(elementRef);
    };
  }, [text, repeated, replay]);

  // Create word array for wave animation
  const words = text.split(" ");

  // Create character array for typewriter animation
  const characters = Array.from(text);

  // Define animation variants based on animation type
  const getVariants = () => {
    switch (animation) {
      case "wave":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
              delay: i * duration + delay,
              duration: 0.6,
              ease: [0.2, 0.65, 0.3, 0.9],
            },
          }),
        };

      case "typewriter":
        return {
          hidden: { opacity: 0 },
          visible: (i: number) => ({
            opacity: 1,
            transition: {
              delay: i * duration + delay,
              duration: 0.01,
            },
          }),
        };

      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay,
              duration: 0.8,
              ease: "easeOut",
            },
          },
        };

      case "highlight":
        return {
          hidden: {
            color: "rgba(0,0,0,0.7)",
            textShadow: "none",
          },
          visible: {
            color: "rgba(0,0,0,1)",
            textShadow: `0 0 8px ${highlightColor}40`,
            transition: {
              delay,
              duration: 1.2,
              ease: "easeOut",
            },
          },
        };

      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delay,
              duration: 0.6,
            },
          },
        };
    }
  };

  const variants = getVariants();

  // Create the appropriate HTML element based on tag prop
  const Tag = tag;

  // For typewriter and wave animations, split text into segments (words or characters)
  if (["wave", "typewriter"].includes(animation)) {
    const items = animation === "wave" ? words : characters;
    const separator = animation === "wave" ? " " : "";

    return (
      <Tag
        id={`animated-text-${text.slice(0, 10).replace(/\s/g, "-")}`}
        className={`inline-block ${className}`}
      >
        {items.map((item, i) => (
          <motion.span
            key={i}
            custom={i}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={variants}
            className="inline-block"
            style={{
              whiteSpace: animation === "typewriter" ? "pre" : "normal",
              display: animation === "typewriter" ? "inline" : "inline-block",
            }}
            onAnimationComplete={
              i === items.length - 1 ? onAnimationComplete : undefined
            }
          >
            {item}
            {separator}
          </motion.span>
        ))}
      </Tag>
    );
  }

  // For fade and highlight animations, animate the whole text
  return (
    <motion.div
      id={`animated-text-${text.slice(0, 10).replace(/\s/g, "-")}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      className={className}
      onAnimationComplete={onAnimationComplete}
    >
      <Tag>{text}</Tag>
    </motion.div>
  );
}
