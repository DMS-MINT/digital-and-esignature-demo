import { fetchFeedbackWithKey } from "@/actions/auth/action";
import { FeedbackForm, Feedbacks } from "@/components/feedback/";
// import { FeedbackType } from "@/components/feedback/Feedbacks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { axiosInstance } from "@/utils";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

export default async function Page(){
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["feedbacks"],
		queryFn: () => fetchFeedbackWithKey(),
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
