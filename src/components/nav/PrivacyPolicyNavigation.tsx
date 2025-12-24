import styles from "./EmptyNavigation.module.css";
import TableContentsSelect from "./TableContentsSelect";

function PrivacyPolicyNavigation() {
	return (
		<div className={styles.root}>
			<TableContentsSelect
				entries={[
					{ id: "data-collection", label: "Data Collection" },
					{ id: "cookies", label: "Cookies" },
					{ id: "third-party-services", label: "Third-Party Services" },
					{ id: "your-rights", label: "Your Rights" },
					{ id: "contact", label: "Contact" },
					{ id: "policy-changes", label: "Changes to This Policy" },
				]}
			/>
		</div>
	);
}

PrivacyPolicyNavigation.displayName = "PrivacyPolicyNavigation";

export default PrivacyPolicyNavigation;
