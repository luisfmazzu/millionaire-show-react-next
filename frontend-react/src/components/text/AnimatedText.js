import React, { useState, useEffect } from "react";

function AnimatedText({ text, onAnimationEnd }) {
    const [displayText, setDisplayText] = useState("");
    const [charIndex, setCharIndex] = useState(0);
  
    useEffect(() => {
      setDisplayText("");
      setCharIndex(0);
    }, [text]);
  
    useEffect(() => {
      if (text && charIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + text[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        onAnimationEnd();
      }
    }, [charIndex, text, onAnimationEnd]);
  
    return <p className="text-lg font-mono">{displayText}</p>;
}

export default AnimatedText;