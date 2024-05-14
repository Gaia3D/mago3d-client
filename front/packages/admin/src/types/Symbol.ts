export type SymbolGroupFormPropsType = {
    id: string,
    name: string,
    enabled: boolean,
    onClickNew: () => void,
}

export type UploadedSymbolFileType = {
    name: string,
    width: number,
    height: number,
    size: string,
    id:string,
    src:string,
}