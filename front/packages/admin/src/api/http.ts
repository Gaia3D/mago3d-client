import axios, { AxiosRequestConfig } from "axios";
import keycloak from "./Keycloak";

const createHeaders = () => {
    const headers: any = {
        
    };
    if(keycloak.authenticated) {
        headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return headers;
}

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers = Object.assign(config.headers, createHeaders());
        return config;
    },
    error => {
        console.error(error);
        return Promise.reject(error);
    }
);

export const fileUpload = ({data, config} : {data: FormData, config?: AxiosRequestConfig}) => 
    axiosInstance.postForm(`${import.meta.env.VITE_API_DATASET}/upload`, data, {...config});