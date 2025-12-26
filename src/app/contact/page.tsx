import AppHeaderBorder from "@/components/AppHeaderBorder";
import ContactForm from "@/components/ContactForm";
import PageLayout from "@/components/PageLayout";
import { PAGE_TITLE } from "@/constants";

export const metadata = {
	title: `Contact - ${PAGE_TITLE}`,
	description: "Get in touch with Georgi Nikolov",
};

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
