"use server";

import { axiosInstance } from "@/utils";
import { cookies } from "next/headers";

import { SignJWT, jwtVerify } from "jose";
const SESSION_NAME = "DemoSession";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

interface Feedback {
	id: number;
	content: string;
}

interface FeedbackResponse {
	ok: boolean;
	feedbacks?: Feedback[];
	message?: string;
}

export async function signIn(credentials: { email: string; password: string }) {
	try {
		console.log(credentials);
		const response = await axiosInstance.post("/auth/login/", credentials);

		if (response.data && response.data.session) {
			console.log("Login successful! Session ID:", response.data.session);

			// Session data
			const sessionId = response.data.session;
			const expires = Date.now() + 24 * 60 * 60 * 1000;
			const session = await encrypt({ sessionId, expires });

			// Set session cookie
			cookies().set(SESSION_NAME, session, {
				expires: new Date(expires),
				httpOnly: true,
				sameSite: "lax",
				secure: false, // Change to true in production
			});

			return { ok: true, message: "እንኳን ደህና መጡ! በተሳካ ሁኔታ ገብተዋል።" };
		} else {
			console.log(" Session ID:", response.data.session);
			return { ok: false, message: "የተጠቃሚ መለያ ወይም የይለፍ ቃል ተሳክቷል።" };
		}
	} catch (error: any) {
		console.error("Login failed:", error);
		return {
			ok: false,
			message: error.response?.data?.message || "እባክዎ በመልእክት ችግኝ አጋጣሚ!",
		};
	}
}

export async function signOut() {
	try {
		await axiosInstance.get("auth/logout/");

		cookies().set(SESSION_NAME, "", { expires: new Date(0) });
	} catch (error: any) {
		throw new Error("እባክዎ በመልእክት ችግኝ አጋጣሚ!");
	}
}

export async function fetchFeedbackWithKey(): Promise<FeedbackResponse> {
	try {
		const response = await axiosInstance.get("/feedbacks/withkey/");

		if (response.data && Array.isArray(response.data.feedbacks)) {
			console.log("Feedback with key:", response.data.feedbacks);
			return { ok: true, feedbacks: response.data.feedbacks };
		} else {
			return { ok: false, message: "No feedback found." };
		}
	} catch (error: any) {
		console.error("Failed to fetch feedback with key:", error);
		return {
			ok: false,
			message: error.response?.data?.message || "እባክዎ በመልእክት ችግኝ አጋጣሚ!",
		};
	}
}
export async function encrypt(payload: any) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1 day")
		.sign(key);
}

export async function decrypt(input: string): Promise<any> {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload;
}

export async function get_session() {
	const session = cookies().get(SESSION_NAME)?.value;
	if (!session) return null;

	return await decrypt(session);
}
