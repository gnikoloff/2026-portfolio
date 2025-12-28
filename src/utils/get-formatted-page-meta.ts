import { PAGE_CREATOR } from "@/constants";
import { Metadata } from "next";

export const getFormattedPageMeta = ({
	title,
	description,
	imgUrl,
}: {
	title: string;
	description: string;
	imgUrl: string;
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
				url: imgUrl,
			},
		],
	},
	openGraph: {
		title,
		description,
		type: "website",
		images: [
			{
				url: imgUrl,
			},
		],
	},
});
