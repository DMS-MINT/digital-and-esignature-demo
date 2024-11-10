"use client";

import { LaptopMinimal, Mail, MapPin, Phone, ScanSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
const ICON_SIZE: number = 16;

export default function CoverPage() {
	const [participants, setParticipants] = useState<{
		primary: number;
		cc: number;
		bcc: number;
	}>({
		primary: 1,
		cc: 1,
		bcc: 1,
	});

	return (
		<div className=" bg-white p-16 w-[797px] h-[280mm]">
			<div className="flex flex-col h-full">
				<header className="flex justify-between items-center mb-4">
					<img src="/image/star.png" alt="Logo 1" className="w-20 h-20" />
					<div className="flex flex-col items-center w-full font-serif">
						<h2 className="text-2xl font-bold text-gray-800 text-center">
							በ ኢትዮጲያ ፌደረላዊ ሪፐብሊክ
						</h2>
						<h2 className="text-xl font-bold text-gray-800 text-center">
							የኢኖቬሽንና ቴክኖሎጂ ሚኒስቴር
						</h2>
						<p className="text-base  text-gray-600 text-center">
							The Federal Democratic Republic of Ethiopia
						</p>
						<p className="text-base  text-gray-600 text-center">
							Minister of Innovation and Technology
						</p>
					</div>
					<img src="/image/innovation.png" alt="Logo 1" className="w-28 h-20" />
				</header>

				<hr className="mb-4 border-b-1 border-black" />

				<div className="flex flex-col items-end gap-1 pt-2 font-serif">
					<div className="flex gap-2 ">
						<div className="flex flex-col  ">
							<p className="text-sm  text-gray-600">ቁጥር</p>
							<p className="text-sm  text-gray-600">ref.no</p>
						</div>
						<div className="flex flex-col w-32 font-mono">
							<p>ሐምሌ 7 /2016</p>
							<hr className="border-b-1 border-black" />
						</div>
					</div>
					<div className="flex gap-2 font-serif">
						<div className="flex flex-col ">
							<p className="text-sm  text-gray-600">ቀን</p>
							<p className="text-sm  text-gray-600">Date</p>
						</div>
						<div className="flex flex-col w-32 font-mono  ">
							<p>DOC-2024-0001</p>
							<hr />
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1 pt-4 font-serif ">
					{Array.from({ length: participants.primary }).map((_, index) => (
						<div key={index} className="flex gap-2">
							<p className="text-lg text-black">ለ</p>
							<input type="text" className="border border-black" />
							{index === participants.primary - 1 ? (
								<button
									onClick={() =>
										setParticipants((prevParticipants) => ({
											...prevParticipants,
											primary: prevParticipants.primary + 1,
										}))
									}
								>
									Add
								</button>
							) : (
								<button
									onClick={() =>
										setParticipants((prevParticipants) => ({
											...prevParticipants,
											primary: prevParticipants.primary - 1,
										}))
									}
								>
									Remove
								</button>
							)}
						</div>
					))}
					<p className="text-lg text-black underline">አዲስ አበባ</p>
				</div>

				<p className="text-lg text-black text-center my-3">
					ጉዳዩ:- <input type="text" className="border border-black" />
				</p>

				<div className="flex flex-col font-serif flex-1 overflow-hidden">
					<textarea name="" id="" className="h-full"></textarea>
				</div>

				<div className="border border-dashed border-gray-500 w-60 h-20 mt-4 ml-auto">
					Signature
				</div>

				<div className="pt-4 pb-6 font-serif">
					<p>ግልባጭ:-</p>
					<ul className="pl-5">
						<div className="flex flex-col gap-1 pt-4 font-serif ">
							{Array.from({ length: participants.cc }).map((_, index) => (
								<div key={index} className="flex gap-2">
									<p className="text-lg text-black">ለ</p>
									<input type="text" className="border border-black" />
									{index === participants.cc - 1 ? (
										<button
											onClick={() =>
												setParticipants((prevParticipants) => ({
													...prevParticipants,
													cc: prevParticipants.cc + 1,
												}))
											}
										>
											Add
										</button>
									) : (
										<button
											onClick={() =>
												setParticipants((prevParticipants) => ({
													...prevParticipants,
													cc: prevParticipants.cc - 1,
												}))
											}
										>
											Remove
										</button>
									)}
								</div>
							))}

							<p className="underline">ኢ.ቴ.ሚ</p>
						</div>
					</ul>
				</div>

				<hr className="mb-1 border-b-1 border-black mt-auto" />

				<footer className="flex justify-between items-center">
					<div className="flex flex-col gap-1 text-xs">
						<div className="flex gap-1 ">
							<LaptopMinimal size={ICON_SIZE} />
							<p>WWW.MINT.gov.et</p>
						</div>
						<div className="flex gap-1 ">
							<Phone size={ICON_SIZE} />
							<p>251111264994</p>
						</div>
						<div className="flex gap-1 ">
							<ScanSearch size={ICON_SIZE} />
							<p>mint @ethionet.et </p>
						</div>
						<div className="flex gap-1 ">
							<Mail size={ICON_SIZE} />
							<p>2490 </p>
						</div>
						<div className="flex gap-1 ">
							<MapPin size={ICON_SIZE} />
							<p className="block min-h-fit">Addis Ababa Ethiopia </p>
						</div>
					</div>
					<div className="flex flex-col items-center w-fit">
						<h2 className="text-xl font-bold text-gray-800 text-center">
							ከእርምጃ ወደ ሩጫ
						</h2>
						<p className="text-base text-gray-600 text-center">
							From Faciltator to Main Actor
						</p>
					</div>
					<img src="/image/qr.png" alt="Logo 1" className="w-24 aspect-square" />
				</footer>
			</div>
		</div>
	);
}
