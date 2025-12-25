"use client";

import { useUIStore } from "@/store/uiStore";
import NextLink from "next/link";
import { ComponentProps } from "react";

function Link(props: ComponentProps<typeof NextLink>) {
	const { setIsLoadingPage } = useUIStore();
	return (
		<NextLink
			{...props}
			onClick={(e) => {
				setIsLoadingPage(true);
				props.onClick?.(e);
			}}
		/>
	);
}

Link.displayName = "Link";

export default Link;
