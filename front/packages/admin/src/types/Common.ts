export type NavLinkListProps = {
    path:string, 
    className?:string, 
    text:string,
    activeClassName?:string
}

export type KeycloakPaginationQuery = {
    first?: number;
    max?: number;
}


export type UploadedFile = {
    assetId: string,
    dbId: string,
    clientId: string,
    filename?:string,
    uploded:boolean
}

export type LoadingStateType= {
    loading: boolean,
    msg: string
}
