<!-- global size=large body=medium transition=fade -->
<!-- size=massive center bg=#1a1a1a color=#fff -->
# Deck Builder
Markdown-Powered Presentations

Create beautiful slide decks using markdown with special syntax for styling and layout.

For setup and installation instructions, visit the [GitHub repository](https://github.com/dekanbro/deckbuilder).
---
<!-- transition=slide -->
# What is Deck Builder?

A powerful presentation tool that transforms markdown into interactive slides with:

- **Custom styling** through HTML comments
- **Flexible layouts** with positioning options  
- **Smooth transitions** between slides
- **Image handling** with alignment controls
- **Typography** with Google Fonts integration
---
<!-- transition=zoom -->
# Getting Started with Syntax

All slide customizations use HTML comment syntax:

```markdown
<!-- option=value option2=value2 -->
# Your Slide Title
Your slide content here
---
```

**Key concepts:**
- Global options affect all slides
- Slide-specific options override globals
- Use `---` to separate slides
---
# Available Options Reference

## Layout & Positioning
- `center` - Center content vertically and horizontally
- `imgpos=left|right` - Align images left or right (default: center)

## Styling
- `bg=#color` - Set background color (hex, rgb, or named colors)
- `color=#color` - Set text color
- `font=FontName` - Use Google Fonts (e.g., Roboto, Lora)
- `size=large|huge|massive` - Increase heading size

## Animations
- `transition=fade|slide|zoom|none` - Set slide transition
- Global: `<!-- global transition=fade -->` (affects all slides)
- Per-slide: `<!-- transition=slide -->` (overrides global)
---
# Basic Markdown Support

Standard markdown elements work seamlessly:

## Headings
```markdown
# H1 Heading
## H2 Heading  
### H3 Heading
```

## Text Formatting
**Bold text**, *italic text*, and `inline code`

## Lists
- Bullet point one
- Bullet point two
  - Nested item
  - Another nested item

1. Numbered list
2. Second item
3. Third item
---
---
# Customizing Deck Styles

## Global Options
Set options that apply to all slides at the top of your deck:

```markdown
<!-- global size=large body=medium transition=fade -->
```

## Per-Slide Options  
Override global settings for individual slides:

```markdown
<!-- center bg=#222 color=#fff -->
# This slide has custom styling
```

## CSS Customization
Edit `MarkdownRenderer.module.css` to customize:
- **Fonts:** Change `font-family` in `.deckSlideContent`
- **Colors:** Adjust `background` and `color` properties  
- **Typography:** Style headings, code blocks, etc.
---
# Global vs Slide Options

## How They Work Together

1. **Global options** (set at top) apply to all slides
2. **Slide options** override globals for that specific slide
3. **CSS styles** provide the base styling foundation

## Example Structure
```markdown
<!-- global transition=fade size=large -->

<!-- center bg=#f5f5f5 -->
# First slide (centered, custom bg)

---
# Second slide (uses global settings)

---
<!-- transition=zoom color=#red -->
# Third slide (zoom transition, red text)
```
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
---
# Advanced Features

## Code Blocks with Syntax Highlighting
```javascript
function createSlide(markdown) {
  return parseMarkdown(markdown);
}
```

```css
.custom-slide {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
}
```

## Tables for Layout
Perfect for organizing content in columns:

| Feature | Description | Example |
|---------|-------------|---------|
| Center | Centers content | `<!-- center -->` |
| Background | Custom colors | `<!-- bg=#ff0000 -->` |
| Fonts | Google Fonts | `<!-- font=Roboto -->` |
---
# Tips & Best Practices

## Organizing Your Deck
1. **Start with globals** - Set consistent styling at the top
2. **Use separators** - `---` creates clean slide breaks  
3. **Test transitions** - Preview how slides flow together
4. **Keep it simple** - Less is often more effective

## Performance Tips
- **Optimize images** - Use appropriate sizes and formats
- **Limit animations** - Too many transitions can be distracting
- **Test on devices** - Ensure readability on different screens

## Resources
- 📚 [GitHub Repository](https://github.com/dekanbro/deckbuilder) - Setup and documentation
- 🎨 [Google Fonts](https://fonts.google.com) - Typography options
- 🖼️ [Unsplash](https://unsplash.com) - Free stock images