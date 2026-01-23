import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { SiteMetadata } from "@/data/resume";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = SiteMetadata;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Toaster />
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
