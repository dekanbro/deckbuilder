"use client";
import React, { useState } from "react";
import { ArrowLeft, ExternalLink, Github, FileText, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface LoadForm {
  sourceType: 'github' | 'hackmd';
  url: string;
}

export default function LoadPage() {
  const [form, setForm] = useState<LoadForm>({
    sourceType: 'github',
    url: ''
  });
  
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    deckUrl: string;
    parsedInfo: string;
  } | null>(null);

  const handleInputChange = (field: keyof LoadForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
    setPreview(null);
  };

  const validateAndGenerateUrl = async () => {
    if (!form.url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsValidating(true);
    setError("");
    setPreview(null);

    try {
      let deckParam = '';
      let parsedInfo = '';

      if (form.sourceType === 'github') {
        // Parse GitHub URL
        const githubResult = parseGitHubUrl(form.url);
        if (!githubResult.success) {
          throw new Error(githubResult.error);
        }
        deckParam = `github:${githubResult.path}`;
        parsedInfo = `Repository: ${githubResult.user}/${githubResult.repo}\nBranch: ${githubResult.branch}\nFile: ${githubResult.filePath}`;
      } else {
        // Parse HackMD URL
        const hackmdResult = parseHackMDUrl(form.url);
        if (!hackmdResult.success) {
          throw new Error(hackmdResult.error);
        }
        deckParam = `hackmd:${hackmdResult.noteId}`;
        parsedInfo = `Note ID: ${hackmdResult.noteId}\nOriginal URL: ${form.url}`;
      }

      // Generate the deck URL
      const deckUrl = `${window.location.origin}/?deck=${encodeURIComponent(deckParam)}`;
      
      setPreview({
        deckUrl,
        parsedInfo
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse URL';
      
      // Add helpful context for common issues
      let enhancedError = errorMessage;
      if (form.sourceType === 'github' && form.url.includes('github.com')) {
        enhancedError += '\n\n💡 Remember: GitHub repositories must be public to load content.';
      } else if (form.sourceType === 'hackmd' && form.url.includes('hackmd.io')) {
        enhancedError += '\n\n💡 Remember: HackMD notes must be publicly accessible. Check sharing settings.';
      }
      
      setError(enhancedError);
    } finally {
      setIsValidating(false);
    }
  };

  const parseGitHubUrl = (url: string): { success: boolean; error?: string; user?: string; repo?: string; branch?: string; filePath?: string; path?: string } => {
    try {
      // Handle various GitHub URL formats
      const patterns = [
        // https://github.com/user/repo/blob/branch/path/to/file.md
        /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+\.md)/,
        // https://github.com/user/repo/tree/branch/path (for browsing, but we need a specific file)
        // We'll require blob URLs for now to ensure we get a specific file
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          const [, user, repo, branch, filePath] = match;
          
          if (!filePath.endsWith('.md')) {
            return { success: false, error: 'GitHub URL must point to a markdown file (.md)' };
          }

          return {
            success: true,
            user,
            repo,
            branch,
            filePath,
            path: `${user}/${repo}/${branch}/${filePath}`
          };
        }
      }

      return { success: false, error: 'Invalid GitHub URL format. Please use a direct link to a markdown file (github.com/user/repo/blob/branch/file.md)' };
    } catch (error) {
      return { success: false, error: 'Failed to parse GitHub URL' };
    }
  };

  const parseHackMDUrl = (url: string): { success: boolean; error?: string; noteId?: string } => {
    try {
      // Handle various HackMD URL formats
      const patterns = [
        // https://hackmd.io/@user/note-name
        /https:\/\/hackmd\.io\/(@[^\/]+\/[^\/\?#]+)/,
        // https://hackmd.io/note-id
        /https:\/\/hackmd\.io\/([a-zA-Z0-9_-]+)/,
        // Direct note ID (if someone just pastes the ID)
        /^([a-zA-Z0-9_-]+)$/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          const noteId = match[1];
          return {
            success: true,
            noteId
          };
        }
      }

      return { success: false, error: 'Invalid HackMD URL format. Please use a HackMD note URL (hackmd.io/@user/note or hackmd.io/note-id)' };
    } catch (error) {
      return { success: false, error: 'Failed to parse HackMD URL' };
    }
  };

  const openDeck = () => {
    if (preview?.deckUrl) {
      window.open(preview.deckUrl, '_blank');
    }
  };

  const copyUrl = async () => {
    if (preview?.deckUrl) {
      try {
        await navigator.clipboard.writeText(preview.deckUrl);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Load External Deck</h1>
          <p className="text-gray-600">Load presentations from GitHub repositories or HackMD documents.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Source Details</h2>
            
            {/* Source Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Source Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleInputChange('sourceType', 'github')}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition ${
                    form.sourceType === 'github'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </button>
                <button
                  onClick={() => handleInputChange('sourceType', 'hackmd')}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition ${
                    form.sourceType === 'hackmd'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  HackMD
                </button>
              </div>
            </div>

            {/* URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {form.sourceType === 'github' ? 'GitHub URL' : 'HackMD URL'}
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder={
                  form.sourceType === 'github'
                    ? 'https://github.com/user/repo/blob/main/slides.md'
                    : 'https://hackmd.io/@user/note-name or https://hackmd.io/note-id'
                }
              />
              <p className="text-xs text-gray-600 mt-1">
                {form.sourceType === 'github'
                  ? 'Paste a direct link to a markdown file in a GitHub repository'
                  : 'Paste a HackMD note URL (must be publicly accessible)'
                }
              </p>
            </div>

            {/* Example URLs */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Example URLs:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                {form.sourceType === 'github' ? (
                  <>
                    <div className="font-mono bg-gray-50 p-2 rounded text-xs">
                      https://github.com/user/repo/blob/main/slides.md
                    </div>
                    <div className="font-mono bg-gray-50 p-2 rounded text-xs">
                      https://github.com/user/repo/blob/develop/docs/presentation.md
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-mono bg-gray-50 p-2 rounded text-xs">
                      https://hackmd.io/@username/my-presentation
                    </div>
                    <div className="font-mono bg-gray-50 p-2 rounded text-xs">
                      https://hackmd.io/abc123def456
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={validateAndGenerateUrl}
              disabled={isValidating || !form.url.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Generate Deck URL
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-red-700 text-sm">
                  <pre className="whitespace-pre-wrap font-sans">{error}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Deck URL</h2>
            
            {preview && (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Parsed Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-sm text-gray-700 whitespace-pre-line">{preview.parsedInfo}</pre>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Deck URL</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={preview.deckUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900"
                    />
                    <button
                      onClick={copyUrl}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      title="Copy URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={openDeck}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Deck in New Tab
                </button>
              </>
            )}

            {!preview && !isValidating && (
              <div className="text-center py-12 text-gray-500">
                <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Your generated deck URL will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Important Requirements</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <div>
              <strong>GitHub Repositories:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Must be <strong>public</strong> (not private)</li>
                <li>• File must be a markdown (.md) file</li>
                <li>• Use direct blob URLs (github.com/user/repo/blob/branch/file.md)</li>
              </ul>
            </div>
            <div>
              <strong>HackMD Notes:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Must be <strong>publicly accessible</strong> (not private)</li>
                <li>• Set sharing to "Everyone can view" in note settings</li>
                <li>• Private or restricted notes will not work</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <strong>💡 Pro Tip:</strong> The generated URL can be shared with others to view the same presentation. 
              Changes to the source file will be reflected when the URL is accessed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
