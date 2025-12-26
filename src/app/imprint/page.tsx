import AppHeaderBorder from "@/components/AppHeaderBorder";
import Link from "@/components/CustomLink";
import PageLayout from "@/components/PageLayout";
import { BASE_URL, CONTACT_URL_SEGMENT_NAME, PAGE_TITLE } from "@/constants";

export const metadata = {
	title: `Imprint - ${PAGE_TITLE}`,
	description: "Get in touch with Georgi Nikolov",
};

function Imprint() {
	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className="tight-container typeset">
				<h1>Imprint</h1>

				<p>
					<strong>
						Information in accordance with §5 TMG (German Telemedia Act)
					</strong>
				</p>

				<h2 id="contact-information">Contact Information</h2>
				<p>
					Georgi Nikolov
					<br />
					Schwedter Str. 48
					<br />
					10435 Berlin
					<br />
					Germany
				</p>

				<h2 id="contact">Contact</h2>
				<p>
					Website:{" "}
					<a href={BASE_URL} target="_blank">
						{BASE_URL}
					</a>
					<br />
					Email: <Link href={`/${CONTACT_URL_SEGMENT_NAME}`}>Contact Form</Link>
				</p>

				<h2 id="vat-id">VAT ID</h2>
				<p>
					VAT identification number in accordance with §27a VAT Tax Act:
					<br />
					DE344713234
				</p>

				<h2 id="responsible-for-content">Responsible for Content</h2>
				<p>Georgi Nikolov (Address as above)</p>

				<h2 id="dispute-resolution">Dispute Resolution</h2>
				<p>
					The European Commission provides a platform for online dispute
					resolution (OS):{" "}
					<a href="https://ec.europa.eu/consumers/odr">
						https://ec.europa.eu/consumers/odr
					</a>
				</p>
				<p>
					I am not willing or obliged to participate in dispute resolution
					proceedings before a consumer arbitration board.
				</p>

				<h2 id="liability-for-content">Liability for Content</h2>
				<p>
					As a service provider, I am responsible for my own content on these
					pages in accordance with general legislation. However, I am not
					obliged to monitor transmitted or stored third-party information or to
					investigate circumstances that indicate illegal activity.
				</p>

				<h2 id="liability-for-links">Liability for Links</h2>
				<p>
					This website contains links to external third-party websites. I have
					no influence on the content of these websites, therefore I cannot
					accept any liability for this external content. The respective
					provider or operator of the pages is always responsible for the
					content of the linked pages.
				</p>

				<h2 id="copyright">Copyright</h2>
				<p>
					The content and works created by the site operator on these pages are
					subject to German copyright law. Duplication, processing,
					distribution, and any kind of use beyond the limits of copyright law
					require the written consent of the respective author or creator.
				</p>
			</div>
		</PageLayout>
	);
}

Imprint.displayName = "Imprint";

export default Imprint;
