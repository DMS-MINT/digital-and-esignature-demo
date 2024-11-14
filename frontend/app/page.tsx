import { FeedbackForm, Feedbacks } from "@/components/feedback/";
import { FeedbackType } from "@/components/feedback/Feedbacks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from "@/utils";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import SignIn from "./signin/page";

export default async function Home() {



	/*import React, { useState, useEffect } from "react";
import axios from "axios";

// Interface for the feedback data structure
interface Feedback {
  id: string;
  author: {
    full_name: string;
  };
  comment: string;
  e_signature: string;
}

const FeedbackList = () => {
  // State to store feedback data and loading/error states
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the feedback data from the backend API
  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const response = await axios.get("/api/feedbacks");  // Assuming it's a GET request

      // Set the fetched feedbacks to the state
      setFeedbacks(response.data.feedbacks);
    } catch (err) {
      // Handle any errors that occur during the fetch
      setError("Failed to load feedbacks. Please try again.");
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch feedbacks when the component mounts
  useEffect(() => {
    fetchFeedbacks();
  }, []);  // Empty dependency array to run this effect only once when the component mounts

  return (
    <div className="feedback-list">
      <h2>Feedback List</h2>

      {loading && <p>Loading feedbacks...</p>}

      {error && <p className="error-message">{error}</p>}

      {feedbacks.length === 0 && !loading && <p>No feedbacks available.</p>}

      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id} className="feedback-item">
            <div className="feedback-author">
              <strong>{feedback.author.full_name}</strong>
            </div>
            <p className="feedback-comment">{feedback.comment}</p>
            <a href={feedback.e_signature} target="_blank" rel="noopener noreferrer">
              View E-signature
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackList;
*/

	return (
		<main className="h-full flex justify-center items-center">
			<SignIn/>
		</main>
	);
}
