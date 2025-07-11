export interface DeckLoadResult {
  content: string;
  source: string;
  error?: string;
  debug?: string;
}

export class DeckLoader {
  private static readonly MAX_FILE_SIZE = 1024 * 1024; // 1MB limit
  private static readonly GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';
  private static readonly GITHUB_API_BASE = 'https://api.github.com';

  /**
   * Load deck content from various sources
   */
  static async loadDeck(deckParam: string): Promise<DeckLoadResult> {
    let debug = '';
    try {
      debug += `Input deckParam: ${deckParam.slice(0, 100)}...\n`;
      if (deckParam.startsWith('url:')) {
        const result = await this.loadFromUrlEncoded(deckParam.slice(4));
        result.debug = debug + (result.debug || '');
        return result;
      } else if (deckParam.startsWith('github:')) {
        return await this.loadFromGitHub(deckParam.slice(7));
      } else if (deckParam.startsWith('hackmd:')) {
        return await this.loadFromHackMD(deckParam.slice(7));
      } else {
        return {
          content: '',
          source: 'invalid',
          error: 'Invalid deck parameter format. Use url:..., github:user/repo/path, or hackmd:note-id',
          debug,
        };
      }
    } catch (error) {
      return {
        content: '',
        source: 'error',
        error: `Failed to load deck: ${error instanceof Error ? error.message : 'Unknown error'}`,
        debug,
      };
    }
  }

  /**
   * Load deck from URL-encoded string
   */
  private static async loadFromUrlEncoded(encodedString: string): Promise<DeckLoadResult> {
    try {
      // Decode URL-encoded string
      const content = decodeURIComponent(encodedString);
      
      // Check file size
      if (content.length > this.MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024}KB`);
      }

      // Basic markdown validation
      if (!this.isValidMarkdown(content)) {
        throw new Error('Content does not appear to be valid markdown');
      }

      return {
        content,
        source: 'url'
      };
    } catch (error) {
      throw new Error(`URL decode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load deck from GitHub
   */
  private static async loadFromGitHub(githubPath: string): Promise<DeckLoadResult> {
    try {
      // Parse GitHub path: user/repo/branch/path/to/file.md
      const parts = githubPath.split('/');
      if (parts.length < 4) {
        throw new Error('Invalid GitHub path format. Use: user/repo/branch/path/to/file.md');
      }

      const [user, repo, branch, ...filePathParts] = parts;
      const filePath = filePathParts.join('/');

      if (!filePath.endsWith('.md')) {
        throw new Error('GitHub file must be a markdown file (.md)');
      }

      // Try raw GitHub content first (faster, no rate limits)
      const rawUrl = `${this.GITHUB_RAW_BASE}/${user}/${repo}/${branch}/${filePath}`;
      
      try {
        const response = await fetch(rawUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('GitHub file not found. Please check that:\n• The repository is public\n• The file path is correct\n• The file exists in the specified branch');
          } else if (response.status === 403) {
            throw new Error('Access denied to GitHub repository. Please ensure:\n• The repository is public (not private)\n• The file is accessible without authentication');
          } else {
            throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
          }
        }

        const content = await response.text();
        
        // Check file size
        if (content.length > this.MAX_FILE_SIZE) {
          throw new Error(`File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024}KB`);
        }

        // Basic markdown validation
        if (!this.isValidMarkdown(content)) {
          throw new Error('Content does not appear to be valid markdown');
        }

        return {
          content,
          source: `github:${user}/${repo}/${branch}/${filePath}`
        };
      } catch (rawError) {
        // Fallback to GitHub API if raw content fails
        console.warn('Raw GitHub content failed, trying API:', rawError);
        
        const apiUrl = `${this.GITHUB_API_BASE}/repos/${user}/${repo}/contents/${filePath}?ref=${branch}`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('GitHub repository or file not found via API. Please check that:\n• The repository is public\n• The file path is correct\n• The file exists in the specified branch');
          } else if (response.status === 403) {
            throw new Error('GitHub API access denied. Please ensure:\n• The repository is public (not private)\n• You haven\'t exceeded GitHub\'s rate limits');
          } else {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
          }
        }

        const data = await response.json();
        
        if (data.type !== 'file') {
          throw new Error('GitHub path does not point to a file');
        }

        // Decode content from GitHub API response
        const content = atob(data.content);
        
        // Check file size
        if (content.length > this.MAX_FILE_SIZE) {
          throw new Error(`File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024}KB`);
        }

        // Basic markdown validation
        if (!this.isValidMarkdown(content)) {
          throw new Error('Content does not appear to be valid markdown');
        }

        return {
          content,
          source: `github:${user}/${repo}/${branch}/${filePath}`
        };
      }
    } catch (error) {
      throw new Error(`GitHub load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load deck from HackMD
   * Supports both full URLs and note IDs
   * Examples:
   * - hackmd:abc123def456 (note ID)
   * - hackmd:https://hackmd.io/@user/note-id
   * - hackmd:https://hackmd.io/abc123def456
   */
  private static async loadFromHackMD(hackmdParam: string): Promise<DeckLoadResult> {
    try {
      let noteId = '';
      let originalUrl = '';

      // Parse different HackMD URL formats
      if (hackmdParam.startsWith('https://hackmd.io/')) {
        originalUrl = hackmdParam;
        // Extract note ID from various HackMD URL formats
        const urlPatterns = [
          /https:\/\/hackmd\.io\/(@[^\/]+\/)?([a-zA-Z0-9_-]+)/,  // @user/note or direct note
          /https:\/\/hackmd\.io\/([a-zA-Z0-9_-]+)/,              // Direct note ID
        ];
        
        for (const pattern of urlPatterns) {
          const match = hackmdParam.match(pattern);
          if (match) {
            noteId = match[match.length - 1]; // Get the last capture group (note ID)
            break;
          }
        }
        
        if (!noteId) {
          throw new Error('Could not extract note ID from HackMD URL');
        }
      } else {
        // Assume it's a direct note ID
        noteId = hackmdParam;
        originalUrl = `https://hackmd.io/${noteId}`;
      }

      // Validate note ID format (HackMD typically uses alphanumeric with dashes/underscores)
      if (!/^[a-zA-Z0-9_-]+$/.test(noteId)) {
        throw new Error('Invalid HackMD note ID format');
      }

      // Construct download URL
      const downloadUrl = `https://hackmd.io/${noteId}/download`;
      
      // Fetch the markdown content
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain, text/markdown, */*',
          'User-Agent': 'DeckBuilder/1.0',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('HackMD note not found. Please check that:\n• The note ID or URL is correct\n• The note is publicly accessible (not private)\n• The note hasn\'t been deleted');
        } else if (response.status === 403) {
          throw new Error('HackMD note is private or access denied. Please ensure:\n• The note is set to "Everyone can view" in sharing settings\n• The note is not restricted to specific users\n• Try making the note public and retry');
        } else {
          throw new Error(`HackMD request failed: ${response.status} ${response.statusText}. Please ensure the note is publicly accessible.`);
        }
      }

      const content = await response.text();
      
      // Check file size
      if (content.length > this.MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024}KB`);
      }

      // Basic markdown validation
      if (!this.isValidMarkdown(content)) {
        throw new Error('Content does not appear to be valid markdown');
      }

      return {
        content,
        source: `hackmd:${noteId} (${originalUrl})`
      };
    } catch (error) {
      throw new Error(`HackMD load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Basic validation to check if content looks like markdown
   */
  private static isValidMarkdown(content: string): boolean {
    const trimmed = content.trim();
    
    // Must have some content
    if (trimmed.length === 0) return false;
    
    // Check for common markdown patterns
    const markdownPatterns = [
      /^#\s+/m,           // Headers
      /^\*\s+/m,          // Lists
      /^-\s+/m,           // Lists
      /^\d+\.\s+/m,       // Numbered lists
      /\[.*\]\(.*\)/,     // Links
      /!\[.*\]\(.*\)/,    // Images
      /^\s*---+\s*$/m,    // Horizontal rules
      /^\s*```/,          // Code blocks
      /^\s*`[^`]+`/,      // Inline code
    ];

    return markdownPatterns.some(pattern => pattern.test(trimmed));
  }

  /**
   * Encode content to URL-safe string for sharing
   */
  static encodeToUrl(content: string): string {
    return encodeURIComponent(content);
  }

  /**
   * Get shareable URL for current deck
   */
  static getShareableUrl(content: string, currentSlide: number = 0): string {
    const encoded = this.encodeToUrl(content);
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('deck', `url:${encoded}`);
    if (currentSlide > 0) {
      url.searchParams.set('slide', String(currentSlide + 1));
    }
    return url.toString();
  }
} 