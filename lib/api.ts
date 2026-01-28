import axios, { Axios } from "axios";

export const api: Axios = axios.create({
	baseURL: "https://presentify-ai-backend.netlify.app/api/v1",
	withCredentials: true,
	headers: {
		credentials: "include",
	},
});

export const getResponseData = async (res: any): Promise<{ data: any; res: any }> => {
	return {
		data: res?.data,
		res,
	};
};
