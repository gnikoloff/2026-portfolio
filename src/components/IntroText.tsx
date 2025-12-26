import styles from "./IntroText.module.css";

function IntroText() {
	return (
		<div className={`tight-container ${styles.introText}`}>
			<p>
				Georgi Nikolov is a programmer building advanced web and mobile
				applications.
				<br />
				Specializing in real-time rendering, GPU programming, and interactive
				3D.
			</p>
		</div>
	);
}

IntroText.displayName = "IntroText";

export default IntroText;
