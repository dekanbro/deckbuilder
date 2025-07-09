"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Printer } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import { DECK_URL } from "./constants";

// Helper function to get slide number from URL
function getSlideFromURL(): number {
  if (typeof window === 'undefined') return 0;
  const urlParams = new URLSearchParams(window.location.search);
  const slideParam = urlParams.get('slide');
  if (slideParam) {
    const slideNumber = parseInt(slideParam, 10);
    return isNaN(slideNumber) ? 0 : Math.max(0, slideNumber - 1); // Convert to 0-based index
  }
  return 0;
}

// Helper function to update URL with slide number
function updateURLWithSlide(slideIndex: number) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('slide', String(slideIndex + 1)); // Convert to 1-based for URL
  window.history.replaceState({}, '', url.toString());
}

export default function Home() {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(DECK_URL)
      .then((res) => res.text())
      .then((text) => {
        // Split slides by --- delimiter
        const rawSlides = text
          .split(/\n---+\n/g)
          .map((s) => s.trim())
          .filter(Boolean);
        setSlides(rawSlides);
        
        // Set initial slide from URL parameter
        const initialSlide = getSlideFromURL();
        const validSlide = Math.min(initialSlide, rawSlides.length - 1);
        setCurrent(validSlide);
        
        // Update URL if needed (in case the initial slide was out of bounds)
        if (validSlide !== initialSlide) {
          updateURLWithSlide(validSlide);
        }
        
        setLoading(false);
      });
  }, []);

  const goPrev = () => {
    const newSlide = Math.max(0, current - 1);
    setCurrent(newSlide);
    updateURLWithSlide(newSlide);
  };

  const goNext = () => {
    const newSlide = Math.min(slides.length - 1, current + 1);
    setCurrent(newSlide);
    updateURLWithSlide(newSlide);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[1280px] h-[720px] flex items-center justify-center bg-white rounded-lg shadow-lg p-8 mb-4 overflow-auto mx-auto" style={{ minWidth: 320 }}>
        <MarkdownRenderer markdown={slides[current]} />
      </div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ArrowLeft />
        </button>
        <span>
          Slide {current + 1} / {slides.length}
        </span>
        <button
          onClick={goNext}
          disabled={current === slides.length - 1}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ArrowRight />
        </button>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => window.open('/print?mode=deck', '_blank')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          <Printer size={18} /> Print Deck (PDF)
        </button>
        <button 
          onClick={() => window.open('/print?mode=infographic', '_blank')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          <Printer size={18} /> Print Infographic
        </button>
      </div>
    </main>
  );
}
