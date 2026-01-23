"use client";

import { useEffect, useState } from "react";

import Loader from "./ui/Loader";

interface Props {
	user: any;
	logout: () => void;
	loading: boolean;
	width?: string;
	height?: string;
}

const Profile = ({ user, logout, loading, width, height }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [char, setChar] = useState<string>("");
	// ts-ignore
	const [backgroundColor, setBackgroundColor] = useState("");

	useEffect(() => {
		setBackgroundColor(
			localStorage.getItem("avatarColor") ||
				`rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`
		);
		const name = user.name || user.email;
		setChar(name.charAt(0)?.toUpperCase() || "");
	}, []);

	return (
		<div className="relative z-50 inline-block text-left">
			{/* Trigger Button */}
			<button onClick={() => setIsOpen(!isOpen)} className="flex items-center focus:outline-none">
				<span
					className={`${width || "w-10"} ${height || "h-10"} ${height} flex items-center justify-center rounded-full border-2 font-extrabold border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors`}
					style={{
						backgroundColor: backgroundColor,
					}}
				>
					{char}
				</span>
			</button>

			{/* Overlay Panel */}
			{isOpen && (
				<>
					{/* Transparent Backdrop to close on click outside */}
					<div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}></div>

					<div className="absolute z-1000 right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden border dark:border-gray-700">
						{/* User Info Header */}
						<div className="px-4 py-3 border-b dark:border-gray-700">
							<p className="text-xs dark:text-gray-400">{user?.username || "Signed in as"}</p>
							<p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
						</div>

						{/* Menu Links */}
						{/* <div className="py-1">
                            <Link
                                href="/profile"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Your Profile
                            </Link>

                        </div> */}

						{/* Logout Action */}
						<div className="py-1 border-t dark:border-gray-700">
							<button
								onClick={loading ? undefined : logout}
								disabled={loading}
								className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors text-left"
							>
								{loading ? <Loader className="m-auto" /> : <span>Sign out</span>}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Profile;
