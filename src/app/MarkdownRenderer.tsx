import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeUnwrapImages from "rehype-unwrap-images";
import styles from "./MarkdownRenderer.module.css";
import { Components } from "react-markdown";

/**
 * Slide-level options (set via HTML comment at top of slide):
 * <!-- center bg=#222 color=#fff font=Roboto imgpos=left size=huge -->
 * Supported options:
 *   center: centers content
 *   bg: background color (CSS value)
 *   color: text color (CSS value)
 *   font: Google font name (e.g. font=Roboto)
 *   imgpos: image alignment (center, left, right)
 *   size: text size (large, huge, massive)
 */
function parseSlideOptions(markdown: string) {
  const match = markdown.match(/^<!--\s*([^>]*)-->/);
  if (!match) return { options: {}, content: markdown };
  const opts: Record<string, string | boolean> = {};
  match[1].split(/\s+/).forEach((pair) => {
    if (pair === "center") opts.center = true;
    else if (pair.includes("=")) {
      const [k, v] = pair.split("=");
      opts[k] = v;
    }
  });
  const content = markdown.replace(/^<!--[^>]*-->/, "").trimStart();
  return { options: opts, content };
}

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const { options, content } = parseSlideOptions(markdown);
  const classNames = [styles.deckSlideContent];
  if (options.center) classNames.push(styles.centered);
  if (options.size) classNames.push(styles[`size-${options.size}`]);
  const style: React.CSSProperties & { [key: string]: string | undefined } = {};
  if (options.bg) style["--slide-bg"] = options.bg as string;
  if (options.color) style["--slide-color"] = options.color as string;
  if (options.bgimg) style["--slide-bgimg"] = `url('${options.bgimg}')`;

  let fontLink: React.ReactNode | null = null;
  if (options.font) {
    const fontName = String(options.font).replace(/ /g, "+");
    const fontFamily = String(options.font);
    fontLink = (
      <link
        href={`https://fonts.googleapis.com/css?family=${fontName}:wght@400;700&display=swap`}
        rel="stylesheet"
        key={fontName}
      />
    );
    style.fontFamily = `'${fontFamily}', sans-serif`;
  }

  const imgPos = (options.imgpos as string) || "center";
  const imgClass = imgPos === "left" ? styles.imgLeft : imgPos === "right" ? styles.imgRight : styles.imgCenter;

  const components: Components = {
    img: ({ src, alt, title }) => (
      <figure className={imgClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src || ""} alt={alt || ""} />
        {title && <figcaption>{title}</figcaption>}
      </figure>
    ),
  };

  return (
    <>
      {fontLink}
      <div className={classNames.join(" ")} style={style}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeUnwrapImages]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default MarkdownRenderer; 