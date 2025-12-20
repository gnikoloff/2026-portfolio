import {
	ABOUT_SECTION_EXPERIENCE,
	ABOUT_SECTION_INTRO,
	ABOUT_SECTION_SKILLS,
} from "@/constants";
import { useEffect, useState } from "react";

import styles from "./AboutNavigation.module.css";

function AboutNavigation() {
	const [hash, setHash] = useState("");

	useEffect(() => {
		setHash(window.location.hash);

		const handleHashChange = () => {
			setHash(window.location.hash);
		};

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	const section = hash.substring(1);
	const isIntro = section === ABOUT_SECTION_INTRO || hash === "";
	const isSkills = section === ABOUT_SECTION_SKILLS;
	const isExperience = section === ABOUT_SECTION_EXPERIENCE;

	return (
		<nav className="sub-nav-container">
			<ul className={"navList smaller"}>
				<li>
					<a
						className={isIntro ? styles.active : ""}
						href={`#${ABOUT_SECTION_INTRO}`}
					>
						Intro
					</a>
				</li>
				<li>
					<a
						className={isSkills ? styles.active : ""}
						href={`#${ABOUT_SECTION_SKILLS}`}
					>
						Skills
					</a>
				</li>
				<li>
					<a
						className={isExperience ? styles.active : ""}
						href={`#${ABOUT_SECTION_EXPERIENCE}`}
					>
						Experience
					</a>
				</li>
			</ul>
		</nav>
	);
}

AboutNavigation.displayName = "AboutNavigation";

export default AboutNavigation;
