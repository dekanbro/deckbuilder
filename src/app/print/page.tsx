"use client";
import React, { useState, useEffect } from "react";
import MarkdownRenderer from "../MarkdownRenderer";
import styles from "./print.module.css";
import { DECK_URL } from "../constants";

// Helper function to get mode from URL
function getModeFromURL(): string {
  if (typeof window === 'undefined') return 'deck';
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') || 'deck';
}

export default function PrintPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('deck');

  useEffect(() => {
    const currentMode = getModeFromURL();
    setMode(currentMode);

    fetch(DECK_URL)
      .then((res) => res.text())
      .then((text) => {
        // Split slides by --- delimiter
        const rawSlides = text
          .split(/\n---+\n/g)
          .map((s) => s.trim())
          .filter(Boolean);
        setSlides(rawSlides);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      // Auto-print after a short delay to ensure content is rendered
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className={styles.printLoading}>
        <div className={styles.loadingContent}>
          <h1>Preparing for print...</h1>
          <p>Mode: {mode}</p>
        </div>
      </div>
    );
  }

  if (mode === 'infographic') {
    // For infographic mode, we'll show a special layout
    return (
      <div className={`${styles.printContainer} ${styles.infographicMode}`}>
        <div className={styles.infographicHeader}>
          <h1>Deck Infographic</h1>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <div className={styles.infographicContent}>
          {slides.map((slide, index) => (
            <div key={index} className={styles.infographicSlide}>
              <div className={styles.slideNumber}>Slide {index + 1}</div>
              <MarkdownRenderer markdown={slide} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default deck mode - print all slides
  return (
    <div className={`${styles.printContainer} ${styles.deckMode}`}>
      {slides.map((slide, index) => (
        <div key={index} className={styles.printSlide}>
          <MarkdownRenderer markdown={slide} />
          {index < slides.length - 1 && <div className={styles.pageBreak} />}
        </div>
      ))}
    </div>
  );
} 