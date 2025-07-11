"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Printer, Share2, AlertCircle, Loader2, Wand2, Download, Copy } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import { DECK_URL } from "./constants";
import { DeckLoader, DeckLoadResult } from "./deckLoader";
import { parseDeckContent } from "./deckParser";
import Link from "next/link";

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

// Helper function to get deck parameter from URL
function getDeckFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('deck');
}

// Helper function to update URL with slide number
function updateURLWithSlide(slideIndex: number) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('slide', String(slideIndex + 1)); // Convert to 1-based for URL
  window.history.replaceState({}, '', url.toString());
}



// Helper function to load default deck
async function loadDefaultDeck(): Promise<string> {
  const response = await fetch(DECK_URL);
  if (!response.ok) {
    throw new Error(`Failed to load default deck: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

// Helper function to get print URL with deck param
function getPrintUrl(mode: string) {
  const params = new URLSearchParams();
  params.set('mode', mode);
  const deckParam = getDeckFromURL();
  if (deckParam) params.set('deck', deckParam);
  return `/print?${params.toString()}`;
}

export default function Home() {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deckSource, setDeckSource] = useState<string>('default');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [globalSize, setGlobalSize] = useState<string | undefined>(undefined);
  const [globalBody, setGlobalBody] = useState<string | undefined>(undefined);
  const [globalTransition, setGlobalTransition] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadDeck();
  }, []);

  const loadDeck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const deckParam = getDeckFromURL();
      let content: string;
      let source: string;

      if (deckParam) {
        // Load from URL parameter
        const result: DeckLoadResult = await DeckLoader.loadDeck(deckParam);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        content = result.content;
        source = result.source;
      } else {
        // Load default deck
        content = await loadDefaultDeck();
        source = 'default';
      }

      // Parse global options and split slides
      const { globalSize: parsedGlobalSize, globalBody: parsedGlobalBody, globalTransition: parsedGlobalTransition, slides: rawSlides } = parseDeckContent(content);

      if (rawSlides.length === 0) {
        throw new Error('No slides found in deck content');
      }

      setSlides(rawSlides);
      setRawMarkdown(content); // Store the raw markdown content
      setGlobalSize(parsedGlobalSize);
      setGlobalBody(parsedGlobalBody);
      setGlobalTransition(parsedGlobalTransition);
      setDeckSource(source);
      
      // Set initial slide from URL parameter
      const initialSlide = getSlideFromURL();
      const validSlide = Math.min(initialSlide, rawSlides.length - 1);
      setCurrent(validSlide);
      
      // Update URL if needed (in case the initial slide was out of bounds)
      if (validSlide !== initialSlide) {
        updateURLWithSlide(validSlide);
      }

      // Generate share URL if we have content
      if (content) {
        setShareUrl(DeckLoader.getShareableUrl(content, validSlide));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck');
      console.error('Deck loading error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(rawMarkdown);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-4" />
        <p className="text-gray-600">Loading deck...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Failed to Load Deck</h2>
          </div>
          <div className="text-gray-700 mb-4">
            <pre className="whitespace-pre-wrap font-sans text-sm">{error}</pre>
          </div>
          <button
            onClick={loadDeck}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Deck source indicator */}
      {deckSource !== 'default' && (
        <div className="w-full max-w-[1280px] mb-2">
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
            <span className="text-sm text-gray-600">
              Deck source: {deckSource}
            </span>
            <button
              onClick={() => window.location.href = '/'}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Load Default Deck
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1280px] h-[720px] flex items-center justify-center bg-white rounded-lg shadow-lg p-8 mb-4 overflow-auto mx-auto" style={{ minWidth: 320 }}>
        <MarkdownRenderer markdown={slides[current]} globalSize={globalSize} globalText={globalBody} globalTransition={globalTransition} />
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="p-3 rounded-full bg-gray-900 text-white shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
        >
          <ArrowLeft />
        </button>
        <span className="px-4 py-2 rounded-full bg-gray-800 text-white font-semibold shadow-md text-lg tracking-wide">
          Slide {current + 1} / {slides.length}
        </span>
        <button
          onClick={goNext}
          disabled={current === slides.length - 1}
          className="p-3 rounded-full bg-gray-900 text-white shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
        >
          <ArrowRight />
        </button>
      </div>
      
      <div className="flex gap-4 flex-wrap justify-center">
        <Link 
          href="/generate"
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          <Wand2 size={18} /> AI Generate Deck
        </Link>
        <Link 
          href="/load"
          className="flex items-center gap-2 px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
        >
          <Download size={18} /> Load External Deck
        </Link>
        <button 
          onClick={() => window.open(getPrintUrl('deck'), '_blank')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          <Printer size={18} /> Print Deck (PDF)
        </button>
        <button 
          onClick={copyMarkdown}
          className="flex items-center gap-2 px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700"
        >
          <Copy size={18} /> Copy Raw Markdown
        </button>
        {/* note implimented fully */}
        {/* <button 
          onClick={() => window.open(getPrintUrl('infographic'), '_blank')}
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          <Printer size={18} /> Print Infographic
        </button> */}
        {shareUrl && (
          <button 
            onClick={copyShareUrl}
            className="flex items-center gap-2 px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
          >
            <Share2 size={18} /> Copy Share URL
          </button>
        )}
      </div>
    </main>
  );
}
