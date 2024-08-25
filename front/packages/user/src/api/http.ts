import axios, { AxiosRequestConfig } from "axios";
import keycloak from "./keycloak";

const createHeaders = () => {
    const headers: any = {
        
    };
    if(keycloak.authenticated) {
        headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return headers;
}

export const bbsAxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/app/api`
});

bbsAxiosInstance.interceptors.request.use(
    (config) => {
        config.headers = Object.assign(config.headers, createHeaders());
        return config;
    },
    error => {
        console.error(error);
        return Promise.reject(error);
    }
);

export const bbsFileUpload = ({data, config}: { data: FormData, config?: AxiosRequestConfig }) =>
  bbsAxiosInstance.postForm('/bbs/upload', data, {...config});

export const mapnoteFileUpload = ({data, config}: { data: FormData, config?: AxiosRequestConfig }) =>
  bbsAxiosInstance.postForm('/bbs/mapnote/upload', data, {...config});

export const mapnoteExcelFileUpload = ({data, config}: { data: FormData, config?: AxiosRequestConfig }) =>
  bbsAxiosInstance.postForm('/bbs/mapnote/upload/excel', data, {...config});

export const datasetFileUpload = ({data, config}: { data: FormData, config?: AxiosRequestConfig }) =>
    bbsAxiosInstance.postForm('/dataset/upload', data, {...config});

export const datasetMapNoteFileUpload = ({data, config}: { data: FormData, config?: AxiosRequestConfig }) =>
    bbsAxiosInstance.postForm('/dataset/mapnote/upload', data, {...config});

export const datasetMapNoteExcelFileUpload = ({data, config}: { data: FormData, config?: AxiosRequestConfig }) =>
    bbsAxiosInstance.postForm('/dataset/mapnote/upload/excel', data, {...config});