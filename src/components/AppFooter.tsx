import styles from "./AppFooter.module.css";
import SocialList from "./SocialList";

function AppFooter() {
	return (
		<footer className={`${styles.root} tight-container`}>
			<div className={styles.header}>
				<p>©{new Date().getFullYear()} Georgi Nikolov </p>
				<SocialList />
			</div>
			<div className={styles.footer}>
				<a href="">Legal Notice</a>
			</div>
		</footer>
	);
}

AppFooter.displayName = "AppFooter";

export default AppFooter;
