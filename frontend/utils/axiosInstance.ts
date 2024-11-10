import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
	// baseURL: process.env.BASE_API_URL,
	baseURL: "http://127.0.0.1:8000/api/",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosInstance;
