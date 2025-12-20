// import LogoViz from "@/logo-viz/LogoViz";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

const LogoViz = dynamic(() => import("@/logo-viz/LogoViz"), {
	ssr: false,
});

const AppHeader = forwardRef<HTMLElement>((props, ref) => {
	return (
		<header ref={ref} id="app-header" className={`tight-container`}>
			{/* <Logo /> */}
			<LogoViz />
		</header>
	);
});

AppHeader.displayName = "AppHeader";

export default AppHeader;
