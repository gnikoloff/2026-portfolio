import styles from "./IntroText.module.css";

function IntroText() {
	return (
		<div className={`tight-container ${styles.introText}`}>
			<p>
				Georgi Nikolov is a programmer building advanced web and mobile
				applications.<span className={styles.extraSpace}>&nbsp;</span>
				<br className={styles.lineBreak} />
				Specializing in real-time rendering, GPU programming, and interactive
				3D.
			</p>
		</div>
	);
}

IntroText.displayName = "IntroText";

export default IntroText;
