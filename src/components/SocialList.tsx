import styles from "./SocialList.module.css";

function SocialList({ smallerPadding = false }: { smallerPadding?: boolean }) {
	return (
		<nav className={styles.root}>
			<ul className={`navList ${smallerPadding ? "smaller" : ""}`}>
				<li>
					<a
						href="https://x.com/georgiNikoloff"
						target="_blank"
						className="link-simple"
					>
						X
					</a>
				</li>
				<li>
					<a
						href="https://www.linkedin.com/in/georgi-nikolov-19a49538a/"
						target="_blank"
						className="link-simple"
					>
						LinkedIn
					</a>
				</li>
				<li>
					<a
						href="https://github.com/gnikoloff"
						target="_blank"
						className="link-simple"
					>
						GitHub
					</a>
				</li>
				<li>
					<a
						href="https://codepen.io/gbnikolov"
						target="_blank"
						className="link-simple"
					>
						Codepen
					</a>
				</li>
			</ul>
		</nav>
	);
}

SocialList.displayName = "Social List";

export default SocialList;
