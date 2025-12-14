import "@splidejs/splide/dist/css/splide.min.css";
import "image-compare-viewer/dist/image-compare-viewer.min.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import "./typeset.min.css";

import AppNavigation from "@/components/nav/AppNavigation";
import {
	ABOUT_CUSTOM_TYPE,
	HOME_CUSTOM_TYPE,
	SPEAKING_CUSTOM_TYPE,
	WORKS_CUSTOM_TYPE,
	WRITING_CUSTOM_TYPE,
} from "@/constants";
import { DataProvider } from "@/contexts/DataContext";
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
	const home = await client.getSingle(HOME_CUSTOM_TYPE);
	const about = await client.getSingle(ABOUT_CUSTOM_TYPE);
	const works = await client.getAllByType(WORKS_CUSTOM_TYPE);
	const speakingWorks = await client.getAllByType(SPEAKING_CUSTOM_TYPE);
	const articles = await client.getAllByType(WRITING_CUSTOM_TYPE);

	return (
		<html lang="en">
			<body>
				<DataProvider
					data={{
						home,
						about,
						works,
						speakingWorks,
						articles,
					}}
				>
					<NuqsAdapter>
						<AppNavigation />
						{children}
					</NuqsAdapter>
				</DataProvider>
			</body>
		</html>
	);
}
