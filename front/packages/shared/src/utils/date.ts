import dayjs from "dayjs";
import { Maybe, Scalars, WithAuditable } from "../types/bbs-gen-type";

export const auditableDateFormatter = <T extends WithAuditable>(data: T, format:string): T => {
    if(data.updatedAt) data.updatedAt = dataFormatter(data.updatedAt, format);
    if(data.createdAt) data.createdAt = dataFormatter(data.createdAt, format);
    return data;
}

export const dateFormat =(value: string | number, format?: string): string => {
    return dayjs(value).format(format ?? 'YYYY-MM-DD');
}

export const dataFormatter =(strDate: string | number, format?: string): string => {
    return dayjs(strDate).format(format ?? 'YYYY-MM-DD');
}

export const timestampFormatter =(timestamp: number, format: string): string => {
    return dayjs(timestamp).format(format);
}