"use client";

// import LogoViz from "@/logo-viz/LogoViz";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

import { LOGO_ANIM_HEIGHT, LOGO_ANIM_WIDTH } from "@/constants";
import styles from "./AppHeader.module.css";

const LogoViz = dynamic(() => import("@/logo-viz/LogoViz"), {
	ssr: false,
});

const AppHeader = forwardRef<HTMLElement>((props, ref) => {
	return (
		<header
			ref={ref}
			id="app-header"
			className={`${styles.root} tight-container`}
		>
			{/* <Logo /> */}
			<div className={styles.headerWrapper}>
				<div
					className={styles.logoWrapper}
					style={{
						width: `${LOGO_ANIM_WIDTH}px`,
						height: `${LOGO_ANIM_HEIGHT}px`,
					}}
				>
					<LogoViz />
				</div>
			</div>
		</header>
	);
});

AppHeader.displayName = "AppHeader";

export default AppHeader;
