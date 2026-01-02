import { PrismicNextImage } from "@prismicio/next";
import { JSXMapSerializer } from "@prismicio/react";

const decodeHTMLEntities = (html: string): string => {
	return html
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&");
};

export const jsxSerializer: JSXMapSerializer = {
	paragraph: ({ children }) => <p>{children}</p>,

	listItem: ({ children }) => <li>{children}</li>,

	oListItem: ({ children }) => <li>{children}</li>,

	hyperlink: ({ node, children }) => {
		return <a href={node.data.url}>{children}</a>;
	},

	preformatted: ({ text }) => {
		const lang = "javascript";
		return (
			<pre className="code-snippet">
				<code className={lang}>{text}</code>
			</pre>
		);
	},

	image: ({ node }) => {
		const img = (
			<PrismicNextImage field={node} imgixParams={{ auto: null, q: 100 }} />
		);

		if (node.linkTo) {
			return <a href={node.linkTo.url}>{img}</a>;
		}

		return img;
	},
};
