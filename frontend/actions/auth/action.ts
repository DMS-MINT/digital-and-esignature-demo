import { axiosInstance } from "@/utils";

export async function signIn(credentials: { email: string; password: string }) {
  try {
    console.log(credentials)
    const response = await axiosInstance.post("/auth/login/", credentials,);

    if (response.data && response.data.session) {
      console.log("Login successful! Session ID:", response.data.session);
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



interface Feedback {
  id: number;
  content: string;
}

interface FeedbackResponse {
  ok: boolean;
  feedbacks?: Feedback[];
  message?: string;
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

