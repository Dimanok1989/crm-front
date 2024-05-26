'use client';
import Axios from "axios";
import { makeUseAxios } from "axios-hooks";

const defaultHeaders = {
    "X-Requested-With": `XMLHttpRequest`,
}

export const axios = Axios.create({
    baseURL: "http://localhost:8000/v1",
    timeout: 10000,
    headers: defaultHeaders
});

axios.interceptors.request.use(
    async (config: any) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers = {
                authorization: `Bearer ${token}`,
                ...defaultHeaders,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const useAxios = makeUseAxios({ axios });

export default useAxios;