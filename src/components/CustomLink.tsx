"use client";

import { useLoadingStore } from "@/store/loadingState";
import NextLink from "next/link";
import { ComponentProps } from "react";

function Link(props: ComponentProps<typeof NextLink>) {
	const { setIsLoadingPage } = useLoadingStore();
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
