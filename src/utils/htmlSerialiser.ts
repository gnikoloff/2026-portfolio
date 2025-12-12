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
		const renderedChildren = children;
		const lang = "javascript"; //renderedChildren.substring(0, renderedChildren.indexOf('*'))

		return `<pre class="code-snippet"><code class="${lang}">${htmlToFormattedText(
			renderedChildren,
		)}</code></pre>`;
	},
};
