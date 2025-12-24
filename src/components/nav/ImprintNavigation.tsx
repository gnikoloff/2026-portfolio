import styles from "./EmptyNavigation.module.css";
import TableContentsSelect from "./TableContentsSelect";

function ImprintNavigation() {
	return (
		<div className={styles.root}>
			<TableContentsSelect
				entries={[
					{ id: "contact-information", label: "Contact Information" },
					{ id: "contact", label: "Contact" },
					{ id: "vat-id", label: "VAT ID" },
					{ id: "responsible-for-content", label: "Responsible for Content" },
					{ id: "dispute-resolution", label: "Dispute Resolution" },
					{ id: "liability-for-content", label: "Liability for Content" },
					{ id: "liability-for-links", label: "Liability for Links" },
					{ id: "copyright", label: "Copyright" },
				]}
			/>
		</div>
	);
}

ImprintNavigation.displayName = "ImprintNavigation";

export default ImprintNavigation;
