"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api, getResponseData } from "@/lib/api";

interface AuthContextType {
	isAuthenticated: boolean;
	loading: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>({});
	const router = useRouter();

	const fetchMe = async () => {
		setLoading(true); // 🔥 KEY FIX

		try {
			// const res = await fetch("/api/me", {
			// 	credentials: "include",
			// 	cache: "no-store",
			// });

			const allRes: any = await getResponseData(await api.get("/islogin/me"));
			const res = allRes?.res;
			console.log("qqqqqqqqqqqqqqqqqqq", res);
			if (!res.success) {
				setIsAuthenticated(false);
				setUser({});
				return;
			}

			// const data = await res?.json();
			setUser(res.user || {});
			setIsAuthenticated(true);
		} catch {
			setIsAuthenticated(false);
			setUser({});
		} finally {
			setLoading(false); // 🔥 KEY FIX
		}
	};

	// Initial auth restore
	useEffect(() => {
		fetchMe();
	}, []);

	const login = async () => {
		localStorage.setItem(
			"avatarColor",
			`rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`
		);
		await fetchMe(); // now loading works here too
	};

	const logout = async () => {
		setLoading(true);
		await fetch("/api/logout", { method: "POST" });
		// await api.post("/islogin/logout")
		setIsAuthenticated(false);
		setUser({});
		setLoading(false);
		router.replace("/login");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, loading, login, logout, user }}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return ctx;
};
