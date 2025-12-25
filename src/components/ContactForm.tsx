"use client";

import {
	CONTACT_FORM_ENDPOINT,
	CONTACT_INQUIRY_COLLABORATION,
	CONTACT_INQUIRY_GENERAL_INQUIRY,
	CONTACT_INQUIRY_PROJECT,
	SENT_MAIL_SUCCESS_TIMEOUT_MSG_MS,
} from "@/constants";
import { FormEvent, useState } from "react";
import styles from "./ContactForm.module.css";

function ContactForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
		budget: "",
		contactReason: CONTACT_INQUIRY_PROJECT,
	});
	const [showBudget, setShowBudget] = useState(true);
	const [isSending, setIsSending] = useState(false);
	const [isSendError, setIsSendError] = useState(false);
	const [showSendStatusMsg, setShowSendStatusMsg] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setIsSending(true);

		const response = await fetch(CONTACT_FORM_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		const result = await response.json();

		setIsSending(false);
		setIsSendError(result.success);
		setFormData({
			name: "",
			email: "",
			message: "",
			budget: "",
			contactReason: CONTACT_INQUIRY_PROJECT,
		});

		setShowSendStatusMsg(true);
		setTimeout(() => {
			setShowSendStatusMsg(false);
		}, SENT_MAIL_SUCCESS_TIMEOUT_MSG_MS);
	};

	const form = (
		<form onSubmit={handleSubmit}>
			<fieldset
				disabled={isSending}
				className={`${styles.fieldset} ${isSending ? styles.disabled : ""}`}
			>
				<section className={styles.section}>
					<label className={styles.label} htmlFor="name">
						Name:
					</label>
					<input
						type="text"
						id="name"
						className={`${styles.fullWidth} ${styles.input}`}
						value={formData.name}
						required
						onChange={(e) => {
							const t = e.target as HTMLInputElement;
							setFormData({ ...formData, name: t.value });
						}}
					/>
				</section>
				<section className={styles.section}>
					<label className={styles.label} htmlFor="email">
						Email:
					</label>
					<input
						type="email"
						id="email"
						className={`${styles.fullWidth} ${styles.input}`}
						value={formData.email}
						required
						onChange={(e) => {
							const t = e.target as HTMLInputElement;
							setFormData({ ...formData, email: t.value });
						}}
					/>
				</section>
				<section className={styles.section}>
					<label className={styles.label} htmlFor="subject">
						Regarding:
					</label>
					<select
						name="subject"
						className={`${styles.fullWidth} ${styles.select}`}
						value={formData.contactReason}
						onChange={(e) => {
							const t = e.target;

							setFormData({ ...formData, contactReason: t.value });

							setShowBudget(t.value == CONTACT_INQUIRY_PROJECT);
						}}
					>
						<option>{CONTACT_INQUIRY_PROJECT}</option>
						<option>{CONTACT_INQUIRY_COLLABORATION}</option>
						<option>{CONTACT_INQUIRY_GENERAL_INQUIRY}</option>
					</select>
				</section>
				{showBudget ? (
					<section className={styles.section}>
						<label className={styles.label} htmlFor="budget">
							Budget:
						</label>
						<div className={styles.budgetWrapper}>
							<input
								type="budget"
								id="budget"
								value={formData.budget}
								required
								className={`${styles.budgetInput} ${styles.input}`}
								onChange={(e) => {
									const t = e.target as HTMLInputElement;
									setFormData({ ...formData, budget: t.value });
								}}
							/>
							<h5>USD</h5>
						</div>
					</section>
				) : null}
				<section className={styles.section}>
					<label className={styles.label} htmlFor="message">
						Message:
					</label>
					<textarea
						id="message"
						name="message"
						className={`${styles.fullWidth} ${styles.input}`}
						value={formData.message}
						onChange={(e) =>
							setFormData({ ...formData, message: e.target.value })
						}
						required
						rows={5}
					/>
				</section>
				<section className={styles.section}>
					<button className={`btn ${styles.sendBtn}`} type="submit">
						Send Message
					</button>
				</section>
			</fieldset>
		</form>
	);

	const loader = (
		<div
			className={`${styles.loaderWrapper} ${isSending ? styles.visible : ""}`}
		>
			{/* ... loader JSX ... */}
		</div>
	);

	const successMsg = (
		<div className={styles.iconWrapper}>{/* ... success JSX ... */}</div>
	);

	const errorMsg = (
		<div className={styles.iconWrapper}>{/* ... error JSX ... */}</div>
	);

	return (
		<>
			{loader}
			{showSendStatusMsg ? (isSendError ? successMsg : errorMsg) : form}
		</>
	);
}

ContactForm.displayName = "ContactForm";

export default ContactForm;
