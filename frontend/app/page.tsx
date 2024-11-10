import { FeedbackForm, Feedbacks } from "@/components/feedback/";
import { FeedbackType } from "@/components/feedback/Feedbacks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from "@/utils";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

export default async function Home() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["feedbacks"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("feedbacks/");
				return response.data as FeedbackType[];
			} catch (error) {
				throw new Error(`Error fetching feedbacks: ${error}`);
			}
		},
	});

	return (
		<main className="h-full flex justify-center items-center">
			<Tabs defaultValue="feedbacks" className="w-fit">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
					<TabsTrigger value="feedback_form">Form</TabsTrigger>
				</TabsList>
				<TabsContent value="feedbacks">
					<HydrationBoundary state={dehydrate(queryClient)}>
						<Feedbacks />
					</HydrationBoundary>
				</TabsContent>
				<TabsContent value="feedback_form">
					<FeedbackForm />
				</TabsContent>
			</Tabs>
		</main>
	);
}
