import React from "react";
import Link from "next/link";
import { Video } from "lucide-react";

import Profile from "../Profile";
import { Button } from "./button";
import Loader from "./Loader";

interface Props {
	isAuthenticated: boolean;
	user: any;
	logout: () => void;
	loading: boolean;
}

const Header = ({ isAuthenticated, user, logout, loading }: Props) => {
	return (
		<header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
			<div className="container mx-auto px-6 py-4">
				<nav className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
							<Video className="h-4 w-4" />
						</div>
						<span className="text-xl font-bold">Presentify AI</span>
					</Link>

					<div className="flex items-center space-x-6">
						<Link href="#about">
							<Button className="bg-linear-to-r from-green-500 to-green-300 hover:from-green-600 hover:to-green-200">
								About the project
							</Button>
						</Link>
						{loading ? (
							<Loader />
						) : (
							<React.Fragment>
								{isAuthenticated ? (
									<Profile user={user} logout={logout} loading={loading} />
								) : (
									<Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
										<Button className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg">
											Login
										</Button>
									</Link>
								)}
							</React.Fragment>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
