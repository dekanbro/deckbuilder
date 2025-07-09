"use client";
import React, { useState, useEffect } from "react";
import MarkdownRenderer from "../MarkdownRenderer";
import styles from "./print.module.css";
import { DECK_URL } from "../constants";
import { DeckLoader, DeckLoadResult } from "../deckLoader";

// Helper function to get mode from URL
function getModeFromURL(): string {
  if (typeof window === 'undefined') return 'deck';
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') || 'deck';
}

// Helper function to get deck parameter from URL
function getDeckFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('deck');
}

// Helper function to load default deck
async function loadDefaultDeck(): Promise<string> {
  const response = await fetch(DECK_URL);
  if (!response.ok) {
    throw new Error(`Failed to load default deck: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

export default function PrintPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('deck');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentMode = getModeFromURL();
    setMode(currentMode);
    loadDeck();
  }, []);

  const loadDeck = async () => {
    setLoading(true);
    setError(null);
    try {
      const deckParam = getDeckFromURL();
      let content: string;
      if (deckParam) {
        const result: DeckLoadResult = await DeckLoader.loadDeck(deckParam);
        if (result.error) {
          throw new Error(result.error + (result.debug ? `\nDebug: ${result.debug}` : ''));
        }
        content = result.content;
      } else {
        content = await loadDefaultDeck();
      }
      const rawSlides = content
        .split(/\n---+\n/g)
        .map((s) => s.trim())
        .filter(Boolean);
      if (rawSlides.length === 0) {
        throw new Error('No slides found in deck content');
      }
      setSlides(rawSlides);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck');
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      // Auto-print after a short delay to ensure content is rendered
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, error]);

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

  if (error) {
    return (
      <div className={styles.printLoading}>
        <div className={styles.loadingContent}>
          <h1>Failed to Load Deck</h1>
          <pre style={{ color: 'red', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{error}</pre>
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