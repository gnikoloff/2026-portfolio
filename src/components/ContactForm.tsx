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

		console.log("result", result);
		setIsSending(false);
		setIsSendError(!result.success);
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
					<div className={styles.subjectWrapper}>
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
					</div>
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
			<div className={styles.loaderContainer}>
				<div className={styles.loader} />
				<h3>Sending...</h3>
			</div>
		</div>
	);

	const successMsg = (
		<div className={styles.iconWrapper}>
			<svg
				viewBox="0 0 64 64"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				xmlSpace="preserve"
				className={`${styles.icon} ${styles.success}`}
			>
				<path
					id="success"
					d="M56.103,16.824l-33.296,33.297l-14.781,-14.78l2.767,-2.767l11.952,11.952l30.53,-30.53c0.943,0.943 1.886,1.886 2.828,2.828Z"
				/>
			</svg>
			<h3>Thanks for reaching out! I'll be in touch shortly.</h3>
		</div>
	);

	const errorMsg = (
		<div className={styles.iconWrapper}>
			<svg
				viewBox="0 0 64 64"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				xmlSpace="preserve"
				className={`${styles.icon} ${styles.error}`}
			>
				<path
					id="error-circle"
					d="M32.085,56.058c6.165,-0.059 12.268,-2.619 16.657,-6.966c5.213,-5.164 7.897,-12.803 6.961,-20.096c-1.605,-12.499 -11.855,-20.98 -23.772,-20.98c-9.053,0 -17.853,5.677 -21.713,13.909c-2.955,6.302 -2.96,13.911 0,20.225c3.832,8.174 12.488,13.821 21.559,13.908c0.103,0.001 0.205,0.001 0.308,0Zm-0.282,-4.003c-9.208,-0.089 -17.799,-7.227 -19.508,-16.378c-1.204,-6.452 1.07,-13.433 5.805,-18.015c5.53,-5.35 14.22,-7.143 21.445,-4.11c6.466,2.714 11.304,9.014 12.196,15.955c0.764,5.949 -1.366,12.184 -5.551,16.48c-3.672,3.767 -8.82,6.016 -14.131,6.068c-0.085,0 -0.171,0 -0.256,0Zm-12.382,-10.29l9.734,-9.734l-9.744,-9.744l2.804,-2.803l9.744,9.744l10.078,-10.078l2.808,2.807l-10.078,10.079l10.098,10.098l-2.803,2.804l-10.099,-10.099l-9.734,9.734l-2.808,-2.808Z"
				/>
			</svg>
			<h3>Message failed to send. Please try again.</h3>
		</div>
	);

	return (
		<>
			{loader}
			{showSendStatusMsg ? (isSendError ? errorMsg : successMsg) : form}
		</>
	);
}

ContactForm.displayName = "ContactForm";

export default ContactForm;
