# DeckBuilder

A modern, responsive presentation deck builder built with Next.js 15, React, and TypeScript. Create beautiful slide presentations using simple markdown syntax with advanced styling options.

## Features

- **Markdown-based slides**: Write presentations in simple markdown format
- **Advanced styling options**: Custom backgrounds, fonts, colors, and layouts
- **Large text sizes**: Support for dramatic large, huge, and massive heading sizes
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Navigation controls**: Keyboard and mouse navigation between slides
- **URL state management**: Direct links to specific slides
- **Print support**: Export presentations to PDF and infographics
- **Custom fonts**: Support for Google Fonts integration
- **Image positioning**: Flexible image placement and alignment options

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd deckbuilder
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Creating Your Own Presentation

### Using a Custom Markdown File

1. **Create your markdown file**: Place your presentation file in the `public/` directory
2. **Update the constant**: Open `src/app/constants.ts` and modify the `DECK_URL` constant:

```typescript
// Change this line in src/app/constants.ts
export const DECK_URL = "/your-presentation.md";
```

3. **Restart the development server** to see your changes

### Markdown Syntax

Each slide is separated by `---` delimiters. Here's a basic example:

```markdown
---
# Welcome to My Presentation

This is the first slide of my presentation.

- Point 1
- Point 2
- Point 3
---
# Second Slide

This is the second slide with some **bold text** and *italic text*.

```javascript
console.log("Code blocks are supported!");
```
---
```

### Advanced Styling Options

#### Slide Options

You can add HTML comments at the top of each slide to customize its appearance:

```markdown
<!-- center -->
# Centered Slide
This content will be centered both vertically and horizontally.

<!-- bg=#222 color=#fff -->
# Dark Theme Slide
This slide has a dark background with white text.

<!-- font=Roboto -->
# Custom Font Slide
This slide uses the Roboto font from Google Fonts.

<!-- bgimg=https://example.com/image.jpg -->
# Background Image Slide
This slide has a background image.

<!-- size=huge center -->
# Large Impact Title
This slide uses huge text size for dramatic effect.

<!-- size=massive center bg=#1a1a1a color=#fff -->
# MASSIVE TITLE
This slide combines massive text with dark background.
```

#### Available Options

- `center` - Centers content vertically and horizontally
- `bg=<color>` - Sets background color (hex, rgb, rgba, or named colors)
- `color=<color>` - Sets text color
- `font=<fontname>` - Uses a Google Font (e.g., Roboto, Lora, Pacifico)
- `bgimg=<url>` - Sets a background image
- `imgpos=<position>` - Controls image positioning (left, right, center)
- `size=<size>` - Sets text size for headings (large, huge, massive)

#### Inline Styling

You can also use inline HTML for more precise control:

```markdown
<span style="font-size:2rem; color:#e63946;">Large Red Text</span>
<span style="background:#f4a261; padding:10px;">Highlighted Text</span>
```

### Examples

Check out `public/deck.md` for comprehensive examples of all available features, including:

- Basic slide formatting
- Custom backgrounds and colors
- Font variations
- Large text sizes (large, huge, massive)
- Image positioning and captions
- Multiple image layouts
- Inline styling examples
- Background image overlays

## Loading Decks from URL (Base64 & GitHub)

In addition to using a markdown file in the `public/` directory, you can load a deck directly from a URL parameter. This allows you to share decks instantly without uploading files or changing any code.

### 1. Load from Base64-Encoded Markdown

Encode your markdown file as base64 and use the following URL format:

```
http://localhost:3000/?deck=base64:PASTE_YOUR_BASE64_STRING_HERE
```

- The app will decode and render the markdown as a slide deck.
- Useful for sharing decks without hosting them anywhere.
- Make sure your base64 string is a single line (no spaces or line breaks).

**Example:**
```
http://localhost:3000/?deck=base64:CiMgU2FtcGxlIERlY2sKLS0tCiMgU2xpZGUgMQotLS0KIyBTbGlkZSAy
```

### 2. Load from a Public GitHub Repository

You can load a markdown file directly from a public GitHub repo using this format:

```
http://localhost:3000/?deck=github:username/repo/branch/path/to/file.md
```

- Do **not** include `/blob/` in the path (use the raw path).
- Example for a file at `https://github.com/dekanbro/deckbuilder/blob/main/public/deck.md`:

```
http://localhost:3000/?deck=github:dekanbro/deckbuilder/main/public/deck.md
```

### 3. Printing & Sharing

- These URL parameters work for both viewing and printing (the print/export buttons will preserve the deck source).
- You can share the full URL with others and they will see the same deck.

### 4. Notes & Limitations

- Maximum file size: 1MB
- Only markdown files are supported
- GitHub API has rate limits for unauthenticated users (60 requests/hour)
- Private GitHub repos are not supported
- Base64 URLs can get very long for large decks

---

## Customization

### Styling

The main styling is controlled by `src/app/MarkdownRenderer.module.css`. You can customize:

- Font families and sizes
- Background colors and images
- Text colors and spacing
- Code block styling
- Image positioning and sizing

### Adding New Features

The project is built with a modular architecture:

- `src/app/page.tsx` - Main presentation component
- `src/app/MarkdownRenderer.tsx` - Markdown rendering logic
- `src/app/MarkdownRenderer.module.css` - Styling definitions
- `src/app/constants.ts` - Global constants and configuration
- `src/app/print/page.tsx` - Print/export functionality

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
