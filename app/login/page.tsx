"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import AnimatedBackground from "@/components/AnimatedBackground";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import { api, getResponseData } from "@/lib/api";

export default function LoginPage() {
	const { login, isAuthenticated, loading } = useAuth();
	const router = useRouter(); // 2. Initialize router

	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, router]);

	const [fName, setFName] = useState<string>("");
	const [lName, setLName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [cPassword, setCPassword] = useState<string>("");
	const [loginFlag, setLoginFlag] = useState<boolean>(true);

	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string) => {
		if (!password) return false;
		if (!loginFlag && password !== cPassword) return false;
		return true;
	};

	const handleLogin = async (e: any) => {
		e.preventDefault();
		e.stopPropagation();

		if (!validateEmail(email)) {
			toast.error("Invalid email format");
			setEmail("");
			return;
		}

		if (!loginFlag && !fName) {
			if (fName.length < 3) {
				toast.error("First name must be at least 3 characters long");
				return;
			}
			toast.error("Please enter your first name");
			return;
		}

		if (!loginFlag && !validatePassword(password)) {
			if (password.length < 3) {
				toast.error("Password must be at least 3 characters long");
				setPassword("");
				return;
			}
			toast.error("Invalid password");
			if (password) setPassword("");
			if (cPassword) setCPassword("");
			return;
		}

		try {
			const resObj: any = {
				email,
				password,
			};
			if (!loginFlag) {
				resObj["fName"] = fName;
				resObj["lName"] = lName;
			}
			const { data } = await getResponseData(await api.post(`/auth/${loginFlag ? "login" : "register"}`, resObj));

			if (data?.success) {
				toast.success(data?.message);
				if (loginFlag) login();
			} else {
				toast.error(data?.message);
				return;
			}
			resetForms();
			if (!loading && loginFlag) {
				router.push("/dashboard");
			} else setLoginFlag(true);
		} catch (err: Error | any) {
			toast.error(err?.message);
			resetForms();
		}
	};

	const resetForms = () => {
		if (fName) setFName("");
		if (lName) setLName("");
		if (email) setEmail("");
		if (password) setPassword("");
		if (cPassword) setCPassword("");
	};

	return (
		<>
			<div className="flex items-center min-h-screen p-4 bg-zinc-950 text-white overflow-hidden relative lg:justify-center">
				<AnimatedBackground />
				<div className="flex flex-col overflow-hidden z-10 bg-white dark:bg-gray-900 rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
					{/* Left Sidebar (Blue Section) */}
					<div className="p-4 py-6 text-white bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
						<div className="my-3 text-4xl font-bold tracking-wider text-center">
							<Link href="/">
								<span className="text-white">Presentify AI</span>
							</Link>
						</div>
						<p className="mt-6 font-normal text-center text-gray-300 dark:text-gray-200 md:mt-0">
							Video to PPT is an AI-powered tool that helps you convert your video recordings into presentable.
						</p>
						<p className="flex flex-col items-center justify-center mt-10 text-center">
							<span> PowerPoint presentations</span>
							<span> with just a few clicks.</span>
						</p>
						<p className="mt-6 text-sm text-center text-gray-300 dark:text-gray-200">
							Read our{" "}
							<a href="#" className="underline">
								terms
							</a>{" "}
							and{" "}
							<a href="#" className="underline">
								conditions
							</a>
						</p>
					</div>

					{/* Right Section (Form) */}
					<div className="p-5 bg-white dark:bg-gray-800 md:flex-1">
						<h3 className="my-4 text-2xl font-semibold text-gray-700 dark:text-white">
							{" "}
							{loginFlag ? "Account Login" : "Create Account"}
						</h3>
						<form action="#" className="flex flex-col space-y-5">
							{!loginFlag && (
								<div className="space-y-5">
									<div className="flex flex-col space-y-1">
										<label className="text-sm font-semibold text-gray-500 dark:text-gray-400">First Name</label>
										<input
											type="text"
											id="fname"
											className="px-4 py-2 transition duration-300 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
											autoFocus
											value={fName}
											onChange={(e: any) => setFName(e.target.value)}
										/>
									</div>

									<div className="flex flex-col space-y-1">
										<label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Last Name</label>
										<input
											type="text"
											id="lname"
											className="px-4 py-2 transition duration-300 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
											value={lName}
											onChange={(e: any) => setLName(e.target.value)}
										/>
									</div>
								</div>
							)}
							{/* Email Field */}
							<div className="flex flex-col space-y-1">
								<label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email address</label>
								<input
									type="email"
									id="email"
									className="px-4 py-2 transition duration-300 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
									value={email}
									onChange={(e: any) => setEmail(e.target.value)}
								/>
							</div>

							{/* Password Field */}
							<div className="flex flex-col space-y-1">
								<div className="flex items-center justify-between">
									<label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Password</label>
									{loginFlag && (
										<a
											href="#"
											className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:text-blue-800"
										>
											Forgot Password?
										</a>
									)}
								</div>
								<input
									type="password"
									id="password"
									className="px-4 py-2 transition duration-300 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
									value={password}
									onChange={(e: any) => setPassword(e.target.value)}
								/>
							</div>

							{!loginFlag && (
								<div className="flex flex-col space-y-1">
									<div className="flex items-center justify-between">
										<label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Confirm Password</label>
									</div>
									<input
										type="password"
										id="password"
										className="px-4 py-2 transition duration-300 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
										value={cPassword}
										onChange={(e: any) => setCPassword(e.target.value)}
									/>
								</div>
							)}

							{/* Remember Me */}
							{loginFlag && (
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="remember"
										className="w-4 h-4 transition duration-300 rounded focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-900 dark:bg-gray-700 dark:border-gray-600"
									/>
									<label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Remember me</label>
								</div>
							)}

							{/* Submit Button */}
							<div>
								<button
									onClick={(e: any) => handleLogin(e)}
									disabled={loading}
									className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 dark:bg-blue-600 rounded-md shadow hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-900 focus:ring-4"
									style={{ backgroundColor: loading ? "lightblue" : undefined }}
								>
									{loading ? (
										<div className="flex items-center justify-center mx-auto">
											<Loader className="m-auto" />
										</div>
									) : (
										<span>{loginFlag ? "Log in" : "Register"}</span>
									)}
								</button>
							</div>

							{/* Social Login Divider */}
							<div className="flex flex-col space-y-5">
								<span className="flex items-center justify-center space-x-2">
									<span className="h-px bg-gray-400 dark:bg-gray-600 w-14"></span>
									<span className="font-normal text-gray-500 dark:text-gray-400">or</span>
									<span className="h-px bg-gray-400 dark:bg-gray-600 w-14"></span>
								</span>

								{/* Buttons */}
								<div className="flex flex-col space-y-4">
									{/* Register */}

									{loginFlag ? (
										<a
											onClick={() => setLoginFlag(false)}
											className=" cursor-pointer flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-800 dark:border-gray-600 rounded-md group hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none"
										>
											<span className="flex items-center justify-center">
												<svg
													className="w-5 h-5 text-gray-800 dark:text-gray-200 fill-current group-hover:text-white"
													viewBox="0 0 24 24" // Changed to 24 for better precision and centering
													xmlns="http://www.w3.org/2000/svg"
												>
													<path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
												</svg>
											</span>
											<span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-white">
												Register Now
											</span>
										</a>
									) : (
										<a
											onClick={() => setLoginFlag(true)}
											className=" cursor-pointer flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-800 dark:border-gray-600 rounded-md group hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none"
										>
											<span className="flex items-center justify-center">
												<svg
													className="w-5 h-4 text-gray-800 dark:text-gray-200 transition-colors duration-300 group-hover:text-white"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
													<polyline points="10 17 15 12 10 7" />
													<line x1="15" y1="12" x2="3" y2="12" />
												</svg>
											</span>
											<span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-white">
												Login Now
											</span>
										</a>
									)}

									{/* Go Back */}
									<Link
										href="/"
										className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-blue-500 dark:border-blue-400 rounded-md group hover:bg-blue-500 focus:outline-none"
									>
										<span className="flex items-center justify-center">
											<svg
												className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:text-white transition-colors duration-300"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<line x1="19" y1="12" x2="5" y2="12"></line>
												<polyline points="12 19 5 12 12 5"></polyline>
											</svg>
										</span>
										<span className="text-sm font-medium text-blue-500 dark:text-blue-400 group-hover:text-white">
											Go Back
										</span>
									</Link>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
