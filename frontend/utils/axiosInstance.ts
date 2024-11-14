import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
	// baseURL: process.env.BASE_API_URL,
	baseURL: "http://127.0.0.1:8000/api/",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,  // Ensures that cookies (sessionid and csrftoken) are sent with requests
  });

//   if (typeof window !== "undefined") {
// 	const csrftoken = document.cookie.match(/csrftoken=([\w-]+)/)?.[1];
  
// 	axiosInstance.interceptors.request.use((config) => {
// 	  // Only add CSRF token to state-changing requests (e.g., POST, PUT, DELETE)
// 	  if (csrftoken && ["POST", "PUT", "DELETE"].includes(config.method?.toUpperCase() || "")) {
// 		config.headers["X-CSRFToken"] = csrftoken;
// 	  }
// 	  return config;
// 	});
//   }
// axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
