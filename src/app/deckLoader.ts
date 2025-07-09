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
      if (deckParam.startsWith('base64:')) {
        const result = await this.loadFromBase64(deckParam.slice(7));
        result.debug = debug + (result.debug || '');
        return result;
      } else if (deckParam.startsWith('github:')) {
        return await this.loadFromGitHub(deckParam.slice(7));
      } else {
        return {
          content: '',
          source: 'invalid',
          error: 'Invalid deck parameter format. Use base64:... or github:user/repo/path',
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
   * Load deck from base64 encoded string
   */
  private static async loadFromBase64(base64String: string): Promise<DeckLoadResult> {
    let debug = '';
    try {
      debug += `Raw base64 input (first 100 chars): ${base64String.slice(0, 100)}...\n`;
      // Remove whitespace and newlines
      const cleaned = base64String.replace(/\s+/g, '');
      debug += `Cleaned base64 (first 100 chars): ${cleaned.slice(0, 100)}...\n`;
      // Validate base64 string
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
        debug += 'Base64 validation failed (regex mismatch).\n';
        throw new Error('Invalid base64 string');
      }
      debug += 'Base64 validation passed.\n';
      // Decode base64
      let decoded = '';
      try {
        decoded = atob(cleaned);
        debug += 'Base64 decoded successfully.\n';
      } catch (e) {
        debug += `atob() failed: ${(e instanceof Error ? e.message : e)}\n`;
        throw new Error('Invalid base64 string (atob failed)');
      }
      // Check file size
      if (decoded.length > this.MAX_FILE_SIZE) {
        debug += `Decoded file too large: ${decoded.length} bytes.\n`;
        throw new Error(`File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024}KB`);
      }
      debug += `Decoded file size: ${decoded.length} bytes.\n`;
      // Basic markdown validation (check if it contains common markdown elements)
      if (!this.isValidMarkdown(decoded)) {
        debug += 'Markdown validation failed.\n';
        throw new Error('Content does not appear to be valid markdown');
      }
      debug += 'Markdown validation passed.\n';
      return {
        content: decoded,
        source: 'base64',
        debug,
      };
    } catch (error) {
      debug += `Error: ${error instanceof Error ? error.message : error}\n`;
      throw new Error(`Base64 decode failed: ${error instanceof Error ? error.message : 'Unknown error'}\nDebug: ${debug}`);
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
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
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
   * Encode content to base64 for sharing
   */
  static encodeToBase64(content: string): string {
    return btoa(content);
  }

  /**
   * Get shareable URL for current deck
   */
  static getShareableUrl(content: string, currentSlide: number = 0): string {
    const base64 = this.encodeToBase64(content);
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('deck', `base64:${base64}`);
    if (currentSlide > 0) {
      url.searchParams.set('slide', String(currentSlide + 1));
    }
    return url.toString();
  }
} 