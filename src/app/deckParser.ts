export interface ParsedDeck {
  slides: string[];
  globalSize?: string;
  globalBody?: string;
  globalTransition?: string;
}

/**
 * Parse global deck options and split content into slides
 * @param content - Raw markdown content
 * @returns ParsedDeck object with slides and global options
 */
export function parseDeckContent(content: string): ParsedDeck {
  // Look for global options at the very beginning of the deck
  const globalMatch = content.match(/^<!--\s*global\s+([^>]*)-->/);
  if (!globalMatch) {
    // No global options, return slides as-is
    const slides = content
      .split(/\n---+\n/g)
      .map((s) => s.trim())
      .filter(Boolean);
    return { slides };
  }

  // Parse global options
  const globalOpts: Record<string, string> = {};
  globalMatch[1].split(/\s+/).forEach((pair) => {
    if (pair.includes("=")) {
      const [k, v] = pair.split("=");
      globalOpts[k] = v;
    }
  });

  // Remove global options from content and split into slides
  const contentWithoutGlobal = content.replace(/^<!--\s*global\s+[^>]*-->/, "").trimStart();
  const slides = contentWithoutGlobal
    .split(/\n---+\n/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    slides,
    globalSize: globalOpts.size,
    globalBody: globalOpts.body,
    globalTransition: globalOpts.transition,
  };
} 