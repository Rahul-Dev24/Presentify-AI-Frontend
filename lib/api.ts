import axios, { Axios } from "axios";

export const api: Axios = axios.create({
	baseURL: "http://localhost:8080/api/v1",
	withCredentials: true,
	headers: {
		credentials: "include",
	},
});

export const getResponseData = async (res: any): Promise<{ metaData: any; res: any }> => {
	return {
		res: res?.data,
		metaData: res,
	};
};
