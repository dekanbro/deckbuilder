# DeckBuilder

A modern, responsive presentation deck builder built with Next.js 15, React, and TypeScript. Create beautiful slide presentations using simple markdown syntax with advanced styling options.

## Features

- **Markdown-based slides**: Write presentations in simple markdown format
- **Advanced styling options**: Custom backgrounds, fonts, colors, and layouts
- **Slide transitions**: Smooth animations between slides (fade, slide, zoom, none)
- **Large text sizes**: Support for dramatic large, huge, and massive heading sizes
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Navigation controls**: Keyboard and mouse navigation between slides
- **URL state management**: Direct links to specific slides
- **Print support**: Export presentations to PDF and infographics
- **Custom fonts**: Support for Google Fonts integration
- **Image positioning**: Flexible image placement and alignment options
- **Safe URL sharing**: Share decks via encoded URLs without hosting files

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
- `size=<size>` - Sets heading size (medium, large, huge, massive)
- `body=<size>` - Sets body text size (small, medium, large)
- `transition=<type>` - Sets slide transition (fade, slide, zoom, none)

#### Global Options

You can set global options for the entire deck by adding a special comment at the very beginning of your markdown file:

```markdown
<!-- global size=medium transition=fade -->
# Your First Slide
```

**Available global options:**
- `size=<size>` - Sets default heading size for all slides (medium, large, huge, massive)
- `body=<size>` - Sets default body text size for all slides (small, medium, large)
- `transition=<type>` - Sets default transition for all slides (fade, slide, zoom, none)

Individual slides can still override global settings with their own slide-level options.

**Example:**
```markdown
<!-- global size=large body=large transition=fade -->
# Your First Slide
Content here...
---
<!-- size=huge body=small transition=slide -->
# This slide has huge headings, small body text, and slides in from the right
This paragraph will be small despite the global large setting.
```

#### Slide Transitions

DeckBuilder supports smooth transitions between slides to enhance your presentation experience. You can set a global transition for all slides or override it on individual slides.

**Available Transition Types:**

- **`fade`** - Smooth opacity transition (default, 0.5s ease-in-out)
- **`slide`** - Slide in from right with opacity (0.5s ease-out)
- **`zoom`** - Scale up with opacity (0.5s ease-out)
- **`none`** - No animation (instant transition)

**Global Transition Example:**
```markdown
<!-- global transition=fade -->
# All slides will fade in by default
---
# This slide also fades in
```

**Slide-Level Override Example:**
```markdown
<!-- global transition=fade -->
# This slide fades in (global default)
---
<!-- transition=slide -->
# This slide slides in from the right
---
<!-- transition=zoom -->
# This slide zooms in
---
<!-- transition=none -->
# This slide appears instantly
```

**Combined Options Example:**
```markdown
<!-- transition=slide center bg=#1a1a1a color=#fff -->
# This slide slides in, is centered, and has a dark theme
```

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
- Slide transitions and animations

## Loading Decks from URL (Safe Encoded Markdown & GitHub)

In addition to using a markdown file in the `public/` directory, you can load a deck directly from a URL parameter. This allows you to share decks instantly without uploading files or changing any code.

### 1. Load from Safe Encoded Markdown (Recommended)

Encode your markdown file using URL-safe encoding and use the following URL format:

```
http://localhost:3000/?deck=url:PASTE_YOUR_URL_ENCODED_STRING_HERE
```

- The app will decode and render the markdown as a slide deck
- Uses URL-safe encoding (more reliable than base64 for URLs)
- Useful for sharing decks without hosting them anywhere
- Automatically handles special characters and line breaks

**Example:**
```
http://localhost:3000/?deck=url:%23%20Sample%20Deck%0A---%0A%23%20Slide%201%0A---%0A%23%20Slide%202
```

### 2. Load from Base64-Encoded Markdown (Legacy)

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

### 3. Load from a Public GitHub Repository

You can load a markdown file directly from a public GitHub repo using this format:

```
http://localhost:3000/?deck=github:username/repo/branch/path/to/file.md
```

- Do **not** include `/blob/` in the path (use the raw path).
- Example for a file at `https://github.com/dekanbro/deckbuilder/blob/main/public/deck.md`:

```
http://localhost:3000/?deck=github:dekanbro/deckbuilder/main/public/deck.md
```

### 4. Printing & Sharing

- These URL parameters work for both viewing and printing (the print/export buttons will preserve the deck source).
- You can share the full URL with others and they will see the same deck.

### 5. Notes & Limitations

- Maximum file size: 1MB
- Only markdown files are supported
- GitHub API has rate limits for unauthenticated users (60 requests/hour)
- Private GitHub repos are not supported
- Base64 URLs can get very long for large decks
- URL-encoded strings are more reliable for sharing than base64

---

## Helper Script: Encode Markdown for URL Sharing

If you want to quickly encode a markdown file for use in a deck URL, you can use the provided helper script:

**Location:** `util/encode-test.mjs`

**Usage:**

1. Run the script from the project root with a relative file path:
   ```bash
   node util/encode-test.mjs public/your-file.md
   ```
2. Or use the default file (`public/test.md`):
   ```bash
   node util/encode-test.mjs
   ```
3. The script will output:
   - The URL-encoded markdown (recommended for sharing)
   - The base64-encoded markdown (legacy format)
   - The full `deck` URL parameter (starting with `url:`)
   - A complete example URL for local testing

**Examples:**
```bash
node util/encode-test.mjs public/pitch-deck.md
node util/encode-test.mjs public/deck.md
node util/encode-test.mjs
```

**Note:**
- The script accepts any relative file path from the project root.
- If the file doesn't exist, it will show a helpful usage message.
- This is useful for testing or sharing decks instantly using the new `url:` parameter format.
- URL encoding is recommended over base64 for better reliability in URLs.

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
