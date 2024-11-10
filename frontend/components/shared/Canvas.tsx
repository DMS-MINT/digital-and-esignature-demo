"use client";

import { useCanvas } from "@/hooks";
import { ImageDataType } from "@/types";
import { RotateCcw, Upload } from "lucide-react";
import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "../ui/button";

type CanvasProps = {
	id: string;
	canvasWidth?: number;
	canvasHeight?: number;
	onImageDataChange: (id: string, imageData: ImageDataType) => void;
};

export default function Canvas({
	id,
	onImageDataChange,
	canvasWidth = 500,
	canvasHeight = 300,
}: CanvasProps) {
	const {
		imageData,
		drawingMode,
		canvasRef,
		handleCanvasChange,
		clearCanvas,
		handleFileChange,
	} = useCanvas();

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		onImageDataChange(id, imageData);
	}, [id, imageData]);

	return (
		<div className="relative bg-white rounded-md">
			<input
				type="file"
				hidden
				ref={inputRef}
				onChange={(e) => handleFileChange(e.target.files?.[0], id)}
			/>
			<Button
				size="icon"
				variant="ghost"
				type="button"
				className="absolute left-2 top-1 "
				onClick={() => {
					inputRef.current?.click();
				}}
			>
				<Upload size={18} />
			</Button>
			<Button
				size="icon"
				variant="ghost"
				type="button"
				className="absolute right-2 top-1 "
				onClick={clearCanvas}
			>
				<RotateCcw size={18} />
			</Button>
			{drawingMode ? (
				<SignatureCanvas
					ref={canvasRef}
					canvasProps={{
						width: canvasWidth,
						height: canvasHeight,
						className: "signature-pad",
					}}
					penColor="blue"
					onEnd={() => handleCanvasChange(id)}
				/>
			) : (
				<div
					className={`w-[${canvasWidth}px] h-[${canvasHeight}px] signature-pad flex justify-center items-center`}
				>
					<img src={imageData.blobURL ? imageData.blobURL : ""} />
				</div>
			)}
		</div>
	);
}
