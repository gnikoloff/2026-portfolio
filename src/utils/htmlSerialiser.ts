import { HTMLRichTextSerializer } from "@prismicio/client";

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
	// preformatted: ({ node }) => {
	// 	const text = node.text || "";
	// 	return `<pre><code class="javascript">${text}</code></pre>`;
	// },
};
