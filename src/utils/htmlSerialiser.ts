import { HTMLRichTextSerializer } from "@prismicio/client";

// @ts-ignore
import htmlToFormattedText from "html-to-formatted-text";

const decodeHTMLEntities = (html: string): string => {
	return html
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&");
};

const extractLanguage = (text: string): string | null => {
	const match = text.match(/^<!(\w+)>/);
	return match ? match[1] : null;
};

const removeLanguagePrefix = (text: string): string => {
	return text.replace(/^<!(\w+)>\s*/, "");
};

export const htmlSerializer: HTMLRichTextSerializer = {
	paragraph: ({ children: content }) => {
		return `<p>${decodeHTMLEntities(content)}</p>`;
	},
	listItem: ({ children: content }) => {
		return `<li>${decodeHTMLEntities(content)}</li>`;
	},
	oListItem: ({ children: content }) => {
		return `<li>${decodeHTMLEntities(content)}</li>`;
	},
	preformatted: ({ children }) => {
		const decoded = decodeHTMLEntities(children);
		const extractedLang = extractLanguage(decoded);
		const withoutPrefix = extractedLang
			? removeLanguagePrefix(decoded)
			: decoded;
		const formatted = htmlToFormattedText(withoutPrefix)
			.replaceAll("__LT__", "&lt;")
			.replaceAll("__RT__", "&gt;");

		const language = extractedLang || "javascript";

		return `<pre class="code-snippet"><code class="${language}">${formatted}</code></pre>`;
	},
	image: ({ node }) => {
		const imgixUrl = new URL(node.url);

		// Remove auto compression, set max quality
		imgixUrl.searchParams.delete("auto");
		imgixUrl.searchParams.set("q", "80");

		const alt = node.alt as string;
		const isDiagram = alt.includes("DIAGRAM");
		const hasCaption = alt.includes("CAPTION");

		let caption = "";
		if (hasCaption) {
			caption = alt.substring("CAPTION: ".length);
		}

		const linkUrl = node.linkTo ? node.linkTo.url : null;
		const img = `<img src="${imgixUrl.toString()}" alt="${node.alt || ""}" />`;

		const urlPartial = linkUrl ? `<a href="${linkUrl}">${img}</a>` : img;

		return `
      <div>
        ${
					isDiagram
						? `<p>${urlPartial}</p>`
						: `<p class="block-img">${urlPartial}</p>`
				}
        ${
					hasCaption
						? `
            <p class="img-caption">${caption}</p>
          `
						: ""
				}
      </div>
    `;
	},
};
