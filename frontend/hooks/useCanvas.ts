import { ImageDataType } from "@/types";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const DEFAULT_VALUE: ImageDataType = {
	id: "",
	base64String: "",
	blobURL: "",
};

export default function useCanvas() {
	const [imageData, setImageData] = useState<ImageDataType>(DEFAULT_VALUE);
	const [drawingMode, setDrawingMode] = useState<boolean>(true);
	const canvasRef = useRef<SignatureCanvas>(null);

	const handleCanvasChange = (id: string) => {
		if (canvasRef.current) {
			const base64String: string = canvasRef.current
				.getTrimmedCanvas()
				.toDataURL("image/png");

			const newImageData = {
				id,
				base64String,
				blobURL: "",
			};

			setImageData(newImageData);
		}
	};

	const clearCanvas = () => {
		setImageData({} as ImageDataType);

		setDrawingMode(true);
		canvasRef.current?.clear();
	};

	const handleFileChange = (file: File | undefined, id: string) => {
		if (!file) return;

		setDrawingMode(false);

		if (file.type === "image/png") {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				const base64String = reader.result as string;

				if (base64String) {
					const newImageData = {
						id,
						base64String,
						blobURL: file ? URL.createObjectURL(file) : "",
					};

					setImageData(newImageData);
				}
			};
		} else {
			alert("Please select a PNG file.");
		}
	};

	return {
		imageData,
		drawingMode,
		canvasRef,
		handleCanvasChange,
		clearCanvas,
		handleFileChange,
	};
}
