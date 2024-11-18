import { axiosInstance } from "@/utils";
import { getEmail } from "../auth/action";



export type AuthorType = {
	full_name: string;
};
export type FeedbackType = {
	id: string;
	author: AuthorType;
	comment: string;
};


interface SharePermissionResponse {
    status: string;
    message: string;
  }

export async function fetchFeedbackWithKey(): Promise<{ ok: boolean; feedbacks?: FeedbackType[]; message?: string }> {
	const email: string = await getEmail();
	try {
	  const response = await axiosInstance.get("/feedbacks/withkey/", {
		params: { email: email },
	  });
  
	  if (response.data && Array.isArray(response.data.feedbacks)) {
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
  

  
 export const sharePermissions = async (
    feedbackId: number,
    emails: string[]
  ): Promise<{ok: boolean;message?: string }> => {
    try {
      const response = await axiosInstance.post<SharePermissionResponse>('/share-permission/', {
        feedback_id: feedbackId,
        emails: emails,
      });
  
      return { ok: true, message: "Feedback was shared successfully" };
    } catch (error: any) {
      console.error("Error sharing permissions:", error);
      return {
		ok: false,
		message: error.response?.data?.message || "can not, please try again",
	  };
    }
  };
  