import AppHeaderBorder from "@/components/AppHeaderBorder";
import ContactForm from "@/components/ContactForm";
import PageLayout from "@/components/PageLayout";
import { HOME_CUSTOM_TYPE, PAGE_DESCRIPTION, PAGE_TITLE } from "@/constants";
import { createClient } from "@/prismicio";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getSingle(HOME_CUSTOM_TYPE);
	return getFormattedPageMeta({
		title: `Contact - ${PAGE_TITLE}`,
		description: PAGE_DESCRIPTION,
		img: home.data.preview,
	});
}

export default function Contact() {
	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className="tight-container">
				<ContactForm />
			</div>
		</PageLayout>
	);
}
