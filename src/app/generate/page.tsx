"use client";
import React, { useState } from "react";
import { ArrowLeft, Wand2, Copy, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface GenerationForm {
  apiKey: string;
  keyPoints: string;
  resources: string;
  presentationStyle: string;
  targetAudience: string;
}

export default function GeneratePage() {
  const [form, setForm] = useState<GenerationForm>({
    apiKey: "",
    keyPoints: "",
    resources: "",
    presentationStyle: "professional",
    targetAudience: "general"
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof GenerationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const generateSlides = async () => {
    if (!form.keyPoints.trim()) {
      setError("Please provide key points for your presentation");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedMarkdown("");
    setGeneratedUrl("");

    try {
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: form.apiKey,
          keyPoints: form.keyPoints,
          resources: form.resources,
          presentationStyle: form.presentationStyle,
          targetAudience: form.targetAudience
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate slides');
      }

      setGeneratedMarkdown(data.markdown);
      
      // Create safe URL-encoded parameter
      const encodedMarkdown = encodeURIComponent(data.markdown);
      const deckUrl = `${window.location.origin}/?deck=url:${encodedMarkdown}`;
      setGeneratedUrl(deckUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating slides');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deck Viewer
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Slide Generator</h1>
          <p className="text-gray-600">Generate presentation slides using AI based on your key points and resources.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Presentation Details</h2>
            
            {/* API Key */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                OpenAI API Key (Optional if configured server-side)
              </label>
              <input
                type="password"
                value={form.apiKey}
                onChange={(e) => handleInputChange("apiKey", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="sk-... (leave empty if using server-side key)"
              />
              <p className="text-xs text-gray-600 mt-1">Your API key is only used for this request and not stored. Leave empty if a server-side key is configured.</p>
            </div>

            {/* Key Points */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Key Points *
              </label>
              <textarea
                value={form.keyPoints}
                onChange={(e) => handleInputChange("keyPoints", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="• Main topic overview&#10;• Problem statement&#10;• Solution approach&#10;• Key benefits&#10;• Call to action"
              />
            </div>

            {/* Resources */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Additional Resources (Optional)
              </label>
              <textarea
                value={form.resources}
                onChange={(e) => handleInputChange("resources", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Links, references, data points, quotes, or any additional context..."
              />
            </div>

            {/* Presentation Style */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Presentation Style
              </label>
              <select
                value={form.presentationStyle}
                onChange={(e) => handleInputChange("presentationStyle", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            {/* Target Audience */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Target Audience
              </label>
              <select
                value={form.targetAudience}
                onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="general">General Audience</option>
                <option value="executives">Executives</option>
                <option value="developers">Developers</option>
                <option value="students">Students</option>
                <option value="investors">Investors</option>
                <option value="customers">Customers</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateSlides}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Slides...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Slides
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
            
            {generatedUrl && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Shareable Deck URL</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedUrl)}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    title="Open Deck"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {generatedMarkdown && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Generated Markdown</h3>
                  <button
                    onClick={() => copyToClipboard(generatedMarkdown)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy Markdown
                  </button>
                </div>
                <textarea
                  value={generatedMarkdown}
                  readOnly
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono text-gray-900"
                />
              </div>
            )}

            {!generatedMarkdown && !isGenerating && (
              <div className="text-center py-12 text-gray-500">
                <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Your generated slides will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
