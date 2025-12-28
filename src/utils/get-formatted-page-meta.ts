import { PAGE_CREATOR } from "@/constants";
import { asImageSrc, ImageField } from "@prismicio/client";
import { Metadata } from "next";

export const getFormattedPageMeta = ({
	title,
	description,
	img,
}: {
	title: string;
	description: string;
	img: ImageField;
}): Metadata => ({
	title,
	description,
	twitter: {
		creator: PAGE_CREATOR,
		title: title,
		card: "summary_large_image",
		description: description,
		images: [
			{
				url: asImageSrc(img) ?? "",
			},
		],
	},
	openGraph: {
		title,
		description,
		type: "website",
		images: [
			{
				url: asImageSrc(img) ?? "",
			},
		],
	},
});
