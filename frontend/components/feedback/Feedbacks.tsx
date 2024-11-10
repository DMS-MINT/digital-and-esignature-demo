"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { axiosInstance } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export type AuthorType = {
	full_name: string;
};

export type FeedbackType = {
	id: string;
	author: AuthorType;
	comment: string;
};

export default function Feedbacks() {
	const { toast } = useToast();
	const { data } = useQuery({
		queryKey: ["feedback"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("feedbacks/");
				return response.data.feedbacks as FeedbackType[];
			} catch (error) {
				throw new Error(`Error fetching feedbacks: ${error}`);
			}
		},
	});
	const verifyMutation = useMutation({
		mutationKey: ["validate"],
		mutationFn: async (feedback_id: string) => {
			try {
				const response = await axiosInstance.get(`feedbacks/${feedback_id}/verify`);
				if (response.data.result) {
					toast({
						description:
							"Verification successful! The comment is authentic and has not been tampered with.",
					});
				} else {
					toast({
						variant: "destructive",
						description:
							"Verification failed: The comment has been tampered with or the signature is invalid.",
					});
				}
			} catch (error: unknown) {}
		},
	});
	const tamperMutation = useMutation({
		mutationKey: ["validate"],
		mutationFn: async (feedback_id: string) => {
			try {
				const response = await axiosInstance.get(`feedbacks/${feedback_id}/tamper`);
				console.log(response);
			} catch (error: unknown) {}
		},
	});

	return (
		<Card className="w-[600px] h-[510px]">
			<CardHeader>
				<CardTitle>Feedbacks</CardTitle>
				<CardDescription>
					Share your thoughts with us! Explore feedback from our valued customers,
					helping us improve and serve you better.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3 max-h-[368px] overflow-y-auto">
				{data?.map(({ id, author: { full_name }, comment }) => (
					<div className="flex justify-between">
						<div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
							<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
							<div className="space-y-1">
								<p className="text-sm font-medium leading-none">{full_name}</p>
								<p className="text-sm text-muted-foreground">{comment}</p>
							</div>
						</div>
						<div key={id} className="flex justify-between gap-2">
							{/* <Button
								size={"sm"}
								variant={"default"}
								className="bg-red-700"
								onClick={() => tamperMutation.mutate(id)}
							>
								Tamper
							</Button> */}
							<Button
								size={"sm"}
								variant={"outline"}
								// className="bg-green-700"
								onClick={() => verifyMutation.mutate(id)}
							>
								Verify
							</Button>
						</div>
					</div>
				))}
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	);
}
