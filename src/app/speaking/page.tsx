import { SPEAKING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import SpeakingClient from "../../components/SpeakingClient";

export default async function About() {
	const client = createClient();
	const speakingWorks = await client.getAllByType(SPEAKING_CUSTOM_TYPE);

	return <SpeakingClient speakingWorks={speakingWorks} />;
}
