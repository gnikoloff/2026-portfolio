import "@splidejs/splide/dist/css/splide.min.css";
import "image-compare-viewer/dist/image-compare-viewer.min.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import "./typeset.min.css";

import AppNavigation from "@/components/AppNavigation/AppNavigation";
import { createClient } from "@/prismicio";
import hljs from "highlight.js/lib/core";
import glsl from "highlight.js/lib/languages/glsl";
import javascript from "highlight.js/lib/languages/javascript";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/codepen-embed.css";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("glsl", glsl);
hljs.registerLanguage("swift", swift);

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch data from Prismic
	const client = createClient();
	const works = await client.getAllByType("work");

	return (
		<html lang="en">
			<body>
				<NuqsAdapter>
					<AppNavigation works={works} />
					{children}
				</NuqsAdapter>
			</body>
		</html>
	);
}
