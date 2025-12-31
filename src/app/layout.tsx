import { GoogleAnalytics } from "@next/third-parties/google";
import "@splidejs/splide/dist/css/splide.min.css";
import "image-compare-viewer/dist/image-compare-viewer.min.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import "highlight.js/styles/codepen-embed.css";
import "./globals.css";
import "./typeset.min.css";

import AppHeader from "@/components/AppHeader";
import AppNavigationWrapper from "@/components/nav/AppNavigationWrapper";
import ScrollToTop from "@/components/ScrollToTop";
import {
	ABOUT_CUSTOM_TYPE,
	HOME_CUSTOM_TYPE,
	SPEAKING_CUSTOM_TYPE,
	WORKS_CUSTOM_TYPE,
} from "@/constants";
import { DataProvider } from "@/contexts/DataContext";
import { createClient } from "@/prismicio";
import getBlogPosts from "@/utils/get-blog-posts";
import hljs from "highlight.js/lib/core";
import glsl from "highlight.js/lib/languages/glsl";
import javascript from "highlight.js/lib/languages/javascript";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

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

	const [home, about, works, speakingWorks, articles] = await Promise.all([
		client.getSingle(HOME_CUSTOM_TYPE),
		client.getSingle(ABOUT_CUSTOM_TYPE),
		client.getAllByType(WORKS_CUSTOM_TYPE),
		client.getAllByType(SPEAKING_CUSTOM_TYPE),
		getBlogPosts(),
	]);

	return (
		<html lang="en">
			<body>
				<ScrollToTop />
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
						<Suspense fallback={null}>
							<AppNavigationWrapper />
						</Suspense>
						<AppHeader />
						{children}
					</NuqsAdapter>
				</DataProvider>
			</body>
			<GoogleAnalytics gaId="G-DKFSRTTBFN" />
		</html>
	);
}
