import * as XLSX from "xlsx";
import { download } from "../utils/Download";

export type XLSXWorkSheetProps = {
    data: unknown[],
    header: string[],
    sheetName: string
}

const EXCEL_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//const EXTENSION = '.xlsx';


function createWorkSheet({data, header}: XLSXWorkSheetProps) {
    const ws = XLSX.utils.json_to_sheet(data, /* {
        header,
        skipHeader: true
    } */);
    // console.info(header);
    ws["!cols"] = data.map(() => ({
        wch: 25,
    }));
    
    return ws; 
}

function createWorkBook () {
  return XLSX.utils.book_new();
}

function appendWorkSheet(wb: XLSX.WorkBook, ws: XLSX.WorkSheet, sheetName:string) {
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

function createExcelFileBlob(sheets: XLSXWorkSheetProps[]): Blob {
    const wb = createWorkBook();
    sheets.forEach((sheet) => appendWorkSheet(wb, createWorkSheet(sheet), sheet.sheetName));
    
    const writeResult =XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    return new Blob([writeResult], { type: EXCEL_FILE_TYPE});
}

export function downloadExcelFile(sheets: XLSXWorkSheetProps[], filename:string) {
    const blob = createExcelFileBlob(sheets);
    download(blob, filename);
}