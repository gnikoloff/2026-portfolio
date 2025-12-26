import AppHeaderBorder from "@/components/AppHeaderBorder";
import Link from "@/components/CustomLink";
import PageLayout from "@/components/PageLayout";
import { CONTACT_URL_SEGMENT_NAME, PAGE_TITLE } from "@/constants";

function PrivacyPolicy() {
	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className="tight-container typeset">
				<h1>Privacy Policy</h1>

				<p>
					<strong>Last updated: December 23, 2025</strong>
				</p>

				<p>
					This website is operated by Georgi Nikolov. I respect your privacy and
					am committed to protecting your personal data.
				</p>

				<h2 id="data-collection">Data Collection</h2>
				<p>
					This website uses Google Analytics to understand how visitors use the
					site. Google Analytics collects information such as:
				</p>
				<ul>
					<li>Pages you visit</li>
					<li>Time spent on the site</li>
					<li>Browser and device information</li>
					<li>Approximate geographic location (country/city level)</li>
				</ul>
				<p>
					This data is collected anonymously and used solely to improve the
					website experience.
				</p>

				<h2 id="cookies">Cookies</h2>
				<p>
					This website uses cookies from Google Analytics to collect usage
					statistics. You can disable cookies in your browser settings at any
					time.
				</p>

				<h2 id="third-party-services">Third-Party Services</h2>
				<p>
					Google Analytics is operated by Google LLC. Google's privacy policy
					can be found at:{" "}
					<a href="https://policies.google.com/privacy">
						https://policies.google.com/privacy
					</a>
				</p>

				<h2 id="your-rights">Your Rights</h2>
				<p>Under GDPR, you have the right to:</p>
				<ul>
					<li>Access your personal data</li>
					<li>Request deletion of your data</li>
					<li>Object to data processing</li>
					<li>Withdraw consent at any time</li>
				</ul>

				<h2 id="contact">Contact</h2>
				<p>If you have questions about this privacy policy, please contact:</p>
				<p>
					Georgi Nikolov
					<br />
					<Link href={`/${CONTACT_URL_SEGMENT_NAME}`}>Contact Form</Link>
				</p>

				<h2 id="policy-changes">Changes to This Policy</h2>
				<p>
					I may update this privacy policy from time to time. Changes will be
					posted on this page with an updated revision date.
				</p>
			</div>
		</PageLayout>
	);
}

PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;

export const metadata = {
	title: `Privacy Policy - ${PAGE_TITLE}`,
	description: "Get in touch with Georgi Nikolov",
};
