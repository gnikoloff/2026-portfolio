import {
	ABOUT_SECTION_EXPERIENCE,
	ABOUT_SECTION_INTRO,
	ABOUT_SECTION_SKILLS,
} from "@/constants";

function AboutNavigation() {
	return (
		<nav>
			<ul className={"navList"}>
				<li>
					<a href={`#${ABOUT_SECTION_INTRO}`}>Intro</a>
				</li>
				<li>
					<a href={`#${ABOUT_SECTION_SKILLS}`}>Skills</a>
				</li>
				<li>
					<a href={`#${ABOUT_SECTION_EXPERIENCE}`}>Works</a>
				</li>
			</ul>
		</nav>
	);
}

AboutNavigation.displayName = "AboutNavigation";

export default AboutNavigation;
