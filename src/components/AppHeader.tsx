import { forwardRef } from "react";
import Logo from "./Logo";

const AppHeader = forwardRef<HTMLElement>((props, ref) => {
	return (
		<header ref={ref} id="app-header" className={`container`}>
			<Logo />
		</header>
	);
});

AppHeader.displayName = "AppHeader";

export default AppHeader;
