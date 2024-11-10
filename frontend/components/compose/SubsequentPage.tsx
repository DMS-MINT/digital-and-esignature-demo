"use client";

import {
	LaptopMinimal,
	Mail,
	MapPin,
	Phone,
	ScanSearch,
	ScreenShareOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ICON_SIZE: number = 16;

export default function SubsequentPage() {
	return (
		<div className=" bg-white rounded-lg p-16 w-[797px] h-[280mm]">
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

				<div className="flex flex-col font-serif flex-1 overflow-hidden">
					<textarea name="" id="" className="h-full"></textarea>
				</div>

				<hr className="mb-1 border-b-1 border-black mt-3" />

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
