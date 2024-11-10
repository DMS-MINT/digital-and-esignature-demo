"use client";

import CoverPage from "@/components/compose/CoverPage";
import SubsequentPage from "@/components/compose/SubsequentPage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function page() {
	const [isVisible, setIsVisible] = useState(false);
	const [pageCount, setPageCount] = useState(0);

	return (
		<main className="bg-gray-200 py-5 flex flex-col items-center gap-5">
			<CoverPage />
			{Array.from({ length: pageCount }).map((_, index) => (
				<SubsequentPage />
			))}
			<Button
				variant={"outline"}
				className="w-[797px]"
				onClick={() => setPageCount(pageCount + 1)}
			>
				<Plus size={20} />
			</Button>
		</main>
	);
}
