"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { z } from "zod";

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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { RotateCcw } from "lucide-react";

const formSchema = z.object({
	account_number: z
		.number()
		.int()
		.refine(
			(value) => {
				const strValue = value.toString();
				return strValue.length === 10 && /^[0-9]+$/.test(strValue);
			},
			{
				message: "Account number must be a 10-digit integer",
			}
		),
	amount: z.number(),
	signature: z.string().nonempty({ message: "Signature is required" }),
});

const TransactionForm: React.FC = () => {
	const sigCanvas = useRef<SignatureCanvas>(null);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const handleInputChange = (value: string) => {
		form.setValue("account_number", Number(value));
	};

	const handleAmountChange = (value: string) => {
		form.setValue("amount", Number(value));
	};

	const handleCanvasChange = () => {
		if (sigCanvas.current) {
			const signature: string = sigCanvas.current
				.getTrimmedCanvas()
				.toDataURL("image/png");
			form.setValue("signature", signature);
		}
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<main className="flex justify-center items-center h-full">
			<Card className="w-[600px]">
				<CardHeader className="pb-4">
					<CardTitle>Transaction Request Form</CardTitle>
					<CardDescription>
						Initiate secure transactions with confidence using our streamlined form.
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-3">
							<FormField
								control={form.control}
								name="account_number"
								render={() => (
									<FormItem>
										<FormLabel>Account Number</FormLabel>
										<FormControl>
											<InputOTP maxLength={10} onChange={handleInputChange}>
												<InputOTPGroup className="w-full">
													<InputOTPSlot index={0} className="flex-1" />
													<InputOTPSlot index={1} className="flex-1" />
													<InputOTPSlot index={2} className="flex-1" />
													<InputOTPSlot index={3} className="flex-1" />
													<InputOTPSlot index={4} className="flex-1" />
													<InputOTPSlot index={5} className="flex-1" />
													<InputOTPSlot index={6} className="flex-1" />
													<InputOTPSlot index={7} className="flex-1" />
													<InputOTPSlot index={8} className="flex-1" />
													<InputOTPSlot index={9} className="flex-1" />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage className="form-error-message" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Amount"
												{...field}
												onChange={(e) => handleAmountChange(e.target.value)}
											/>
										</FormControl>
										<FormMessage className="form-error-message" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="signature"
								render={() => (
									<FormItem className="flex-1">
										<FormLabel>Signature Pad</FormLabel>
										<FormControl>
											<div className="relative">
												<Button
													size="icon"
													variant="ghost"
													type="button"
													className="absolute right-2 top-1 "
													onClick={() => sigCanvas.current?.clear()}
												>
													<RotateCcw size={18} />
												</Button>
												<SignatureCanvas
													ref={sigCanvas}
													canvasProps={{
														width: 545,
														height: 170,
														className: "signature-pad",
													}}
													onEnd={handleCanvasChange}
												/>
											</div>
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
		</main>
	);
};

export default TransactionForm;
