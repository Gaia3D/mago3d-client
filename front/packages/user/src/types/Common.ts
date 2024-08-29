import {DatasetAssetForUpdateQuery, DatasetGroupListQuery} from "@mnd/shared/src/types/dataset/gql/graphql.ts";

export type AssetOutletContext = {
    id: string
    data: DatasetAssetForUpdateQuery
}

export type CreateAssetOutletContext = {
    data: DatasetGroupListQuery
}

export enum UploadState {
    READY,
    UPLOADING,
    UPLOAD_COMPLETE,
    COMPLETE
}

export interface UploadFile extends File {
    uuid: string
}

export interface UploadItem {
    uuid: string
    name: string
    progress?: number
    state: UploadState
}

export interface UploadedFile {
    assetId: string,
    dbId: string,
    clientId: string,
    filename?:string,
    uploaded:boolean
}

export interface UploadFile extends File {
    uuid: string
}

export interface UploadItem {
    uuid: string
    name: string
    progress?: number
    state: UploadState
}