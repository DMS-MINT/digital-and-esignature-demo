"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ImageDataType } from "@/types";
import { axiosInstance } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Canvas } from "../shared";

const formSchema = z.object({
	comment: z.string().min(2),
	e_signature: z.string(),
});

export type FeedbackType = {
	comment: string;
	e_signature: string;
};

export default function FeedbackForm() {
	const { toast } = useToast();
	const { mutate } = useMutation({
		mutationFn: async (newFeedback: FeedbackType) => {
			try {
				const response = await axiosInstance.post("feedbacks/create/", newFeedback);
				toast({
					description: response.data.message,
				});
			} catch (error: unknown) {
				const axiosError = error as AxiosError;
				const errorMessage =
					// @ts-ignore
					axiosError.response?.data?.error || "An unexpected error occurred";

				console.log(errorMessage);
				toast({
					variant: "destructive",
					description: errorMessage,
				});
			}
		},
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			comment: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(values);
	}

	const handleImageDataChange = (id: string, imageData: ImageDataType) => {
		form.setValue("e_signature", imageData.base64String);
	};

	return (
		<Card className="w-[600px]">
			<CardHeader className="pb-4">
				<CardTitle>Feedback Form</CardTitle>
				<CardDescription>
					We value your feedback! Please take a moment to share your thoughts with
					us.
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-3">
						<FormField
							control={form.control}
							name="comment"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Your Comment</FormLabel>
									<FormControl>
										<Textarea placeholder="Type your feedback here..." {...field} />
									</FormControl>
									<FormMessage className="form-error-message" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="e_signature"
							render={() => (
								<FormItem className="flex-1">
									<FormLabel>Signature Pad</FormLabel>
									<FormControl>
										<Canvas
											id="feedback_form"
											canvasWidth={545}
											canvasHeight={170}
											onImageDataChange={handleImageDataChange}
										/>
									</FormControl>
									<FormMessage className="form-error-message" />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit">Submit</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
