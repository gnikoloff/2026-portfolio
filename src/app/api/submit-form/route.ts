// app/api/submit-form/route.ts
import { CONTACT_TO_MAIL } from "@/constants";
import { NextResponse } from "next/server";
import { Resend } from "resend";

interface FormData {
	name: string;
	email: string;
	message: string;
	budget: string;
	contactReason: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	try {
		const formData: FormData = await request.json();

		const { data, error } = await resend.emails.send({
			from: CONTACT_TO_MAIL,
			to: [CONTACT_TO_MAIL],
			subject: `Contact Form: ${formData.name} WRT ${formData.contactReason}`,
			html: `
        <strong>Name</strong>: ${formData.name}<br/>
        <strong>Email</strong>: <a href="mailto:${formData.email}">${formData.email}</a><br/>
        <strong>Project Type</strong>: ${formData.contactReason}<br/>
        <strong>Budget</strong>: ${formData.budget} USD<br/>
        <strong>Message</strong>: ${formData.message} 
      `,
		});

		if (error) {
			return NextResponse.json({
				success: false,
				error,
			});
		}

		return NextResponse.json({
			success: true,
			message: "Form submitted successfully",
			data,
		});
	} catch {
		return NextResponse.json(
			{ success: false, message: "Error processing form" },
			{ status: 500 },
		);
	}
}
