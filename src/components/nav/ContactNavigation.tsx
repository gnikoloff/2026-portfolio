import SocialList from "../SocialList";
import styles from "./ContactNavigation.module.css";

function ContactNavigation() {
	return (
		<div className={styles.root}>
			<div className={`sub-nav-container ${styles.navWrapper}`}>
				<SocialList smallerPadding={true} navClassName={styles.nav} />
			</div>
		</div>
	);
}

ContactNavigation.displayName = "ContactNavigation";

export default ContactNavigation;
