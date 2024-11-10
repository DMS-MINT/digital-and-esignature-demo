"use client";

import { Canvas } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ImageDataType } from "@/types";
import { axiosInstance } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function StructuralSimilarity() {
	const [canvasImages, setCanvasImages] = useState<ImageDataType[]>([]);

	const mutation = useMutation({
		mutationKey: ["check_similarity"],
		mutationFn: async () => {
			try {
				const response = await axiosInstance.post("feedbacks/check_similarity/", {
					image_1: canvasImages[0].base64String,
					image_2: canvasImages[1].base64String,
				});
				const similarity: string = response.data.similarity;
				return similarity;
			} catch (error) {
				console.log(error);
				throw new Error(`Error fetching feedbacks: ${error}`);
			}
		},
	});

	const handleImageDataChange = (id: string, imageData: ImageDataType) => {
		const filteredCanvasImages = canvasImages.filter((image) => image.id !== id);

		if (imageData.id) {
			setCanvasImages(() => [...filteredCanvasImages, imageData]);
		} else {
			setCanvasImages(() => [...filteredCanvasImages]);
		}
	};

	const handleSubmit = () => {
		mutation.mutate();
	};

	return (
		<main className="flex flex-col h-full px-10 py-3">
			<nav className="self-center shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] px-5 py-3 rounded-full w-4/5 flex justify-between items-center">
				<h2 className="font-medium">
					Identify similarity between two pictures in %
				</h2>
				<Link href="/">
					<Button>Feedback Form</Button>
				</Link>
			</nav>
			<section className="flex items-center justify-between flex-1">
				<Canvas id="left_canvas" onImageDataChange={handleImageDataChange} />
				<div className="flex flex-col gap-10 items-center">
					<p className="text-gray-800 font-bold text-3xl">
						{mutation.isPending
							? "Checking..."
							: `${mutation.data ? mutation.data : "0"}%`}
					</p>
					<Button
						onClick={handleSubmit}
						disabled={canvasImages.length === 2 ? false : true}
					>
						Check Similarity
					</Button>
				</div>
				<Canvas id="right_canvas" onImageDataChange={handleImageDataChange} />
			</section>
		</main>
	);
}
