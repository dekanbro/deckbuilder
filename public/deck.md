<!-- global size=large body=medium transition=fade -->
<!-- size=massive center bg=#1a1a1a color=#fff -->
# Deck Builder
Next.js Project Bootstrapped

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
---
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
---
<!-- transition=slide -->
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
---
<!-- transition=zoom -->
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
---
<!-- transition=none -->
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
---
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
---
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
---
---
# Customizing Deck Styles

This deck uses a central `MarkdownRenderer` component to render markdown to HTML. You can customize the look and feel of all slides by editing the `MarkdownRenderer.module.css` file.

- **Fonts:** Change the `font-family` in `.deckSlideContent`.
- **Background:** Adjust the `background` property.
- **Text color:** Use the `color` property.
- **Other styles:** Add or modify CSS for headings, code, etc.

All slides will automatically use these styles, making it easy to maintain a consistent appearance.
--- 
---
<!-- center -->
# Centered Slide
This slide uses the `center` option to center all content vertically and horizontally.

Syntax:
```
<!-- center -->
# Centered Slide
```
---
<!-- bg=#222 color=#fff -->
# Custom Background & Text Color
This slide uses a dark background and white text.

Syntax:
```
<!-- bg=#222 color=#fff -->
# Custom Background & Text Color
```
---
<!-- center bg=#f5e663 color=#222 -->
# Centered with Custom Colors
This slide is centered and uses a yellow background with dark text.

Syntax:
```
<!-- center bg=#f5e663 color=#222 -->
# Centered with Custom Colors
```
---
<!-- font=Roboto -->
# Roboto Font
This slide uses the Roboto font from Google Fonts.

Syntax:
```
<!-- font=Roboto -->
# Roboto Font
```
---
<!-- font=Lora -->
# Lora Font
This slide uses the Lora font from Google Fonts.

Syntax:
```
<!-- font=Lora -->
# Lora Font
```
---
---
# Centered Image with Caption

![A beautiful mountain](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80 "A beautiful mountain in the morning light")

This image is centered by default and has a caption.

Syntax:
```
![A beautiful mountain](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80 "A beautiful mountain in the morning light")
```
---
<!-- imgpos=left -->
# Left Aligned Image

![A forest path](https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80 "A peaceful forest path")

This image is aligned to the left using the `imgpos=left` slide option.

Syntax:
```
<!-- imgpos=left -->
![A forest path](https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80 "A peaceful forest path")
```
---
<!-- imgpos=right -->
# Right Aligned Image

![A city skyline](https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=600&q=80 "A city skyline at dusk")

This image is aligned to the right using the `imgpos=right` slide option.

Syntax:
```
<!-- imgpos=right -->
![A city skyline](https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=600&q=80 "A city skyline at dusk")
```
---
# Image Without Caption

![No caption image](https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80)

This image has no caption (no title in markdown).

Syntax:
```
![No caption image](https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80)
```
---
<!-- size=large -->
# Large Text Size
This slide uses the `size=large` option for bigger headings.

Syntax:
```
<!-- size=large -->
# Large Text Size
```

Available sizes: `large`, `huge`, `massive`
---
<!-- size=huge center -->
# Huge Centered Text
This slide uses `size=huge` with center alignment for dramatic impact.

Syntax:
```
<!-- size=huge center -->
# Huge Centered Text
```
---
<!-- size=massive center bg=#1a1a1a color=#fff -->
# MASSIVE TEXT
This slide uses `size=massive` with dark background for maximum impact.

Syntax:
```
<!-- size=massive center bg=#1a1a1a color=#fff -->
# MASSIVE TEXT
```
---
# Multiple Images

## Images in a Table

| Image 1 | Image 2 | Image 3 |
|---------|---------|---------|
| ![Mountain](https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=300&q=80 "Mountain") | ![Forest](https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80 "Forest") | ![Ocean](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80 "Ocean") |

You can display multiple images in a single slide using a table layout.

**Table syntax:**
```
| Image 1 | Image 2 | Image 3 |
|---------|---------|---------|
```
---
<!-- transition=slide center -->
# Transition Examples

This slide demonstrates different transition types:

- **fade**: Smooth opacity transition (default)
- **slide**: Slide in from right with opacity
- **zoom**: Scale up with opacity
- **none**: No animation

## Global vs Slide-level

- **Global**: Set in deck header: `<!-- global transition=fade -->`
- **Slide-level**: Override per slide: `<!-- transition=slide -->`

Both support the same options: `fade`, `slide`, `zoom`, `none`