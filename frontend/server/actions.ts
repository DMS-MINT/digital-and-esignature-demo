"use server";

import { axiosInstance } from "@/utils";

export async function getFeedbacks() {
	try {
		const response = await axiosInstance.get("feedbacks/");
		return response.data;
	} catch (error) {
		return error;
	}
}

export async function createFeedback() {
	try {
		const response = await axiosInstance.post("feedbacks/create");
		return response.data;
	} catch (error) {
		return error;
	}
}
