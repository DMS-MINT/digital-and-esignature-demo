import { get_session } from "@/actions/auth/action";
import axios, { AxiosInstance } from "axios";

axios.defaults.withCredentials = true;
const axiosInstance: AxiosInstance = axios.create({
	baseURL: "http://127.0.0.1:8000/api/",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	async (config) => {
		// Handle session authorization
		if (true) {
			const session = await get_session();
			const sessionId = session?.sessionId;
			console.log(sessionId);
			console.log(session);
			if (session) {
				config.headers.Authorization = `session ${sessionId}`;
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
